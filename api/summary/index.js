import _ from 'lodash'
import db from '../../firebase'

/*
 ** @return Array cohortExercises
*/
export async function getCohortExercises (cohortID = '') {
  const cohortExercises = await db.ref(`cohorts/${cohortID}/exerciseIDs`)
    .once('value').then(snapshot => Object.keys(snapshot.val()))
  // console.log('Cohort exercises:', cohortID)

  return cohortExercises
  
}

export async function getStudentSummary(studentID, cohortExerciseCount = null) {

  const student = await db.ref(`students/${studentID}`).once('value').then(snapshot => snapshot.val())

  const { cohortID, exercises: allAttemptedExercises } = student
  const completedExercises = _.filter(allAttemptedExercises, (val => val.completed))
  const allAttemptedExercisesCount = _.size(allAttemptedExercises)
  const completedCount = _.size(completedExercises)

  if(!cohortExerciseCount) {
    cohortExerciseCount = getCohortExercises(cohortID).length
  }

  const unfinishedCount = allAttemptedExercisesCount - completedCount
  const notStartedCount = cohortExerciseCount - allAttemptedExercisesCount
  return {
    completedCount,
    unfinishedCount,
    notStartedCount,
  }
}

export default (app) => {
  // // here we get all the movies 
  // app.get('/summary/cohort/:cohortID', async (req, res, next) => {
  //   const cohortID = req.params.cohortID
  //   const summary = await getStudentSummary()
  //   repo.getAllMovies().then(movies => {
  //     res.status(status.OK).json(movies)
  //   }).catch(next)
  // })

  app.get('/summary/students/:studentID', async (req, res, next) => {
    const studentID = req.params.studentID
    const summary = await getStudentSummary(studentID)
    // repo.getMoviePremiers().then(movies => {
    //   res.status(status.OK).json(movies)
    // }).catch(next)
    res.status(status.OK).json(summary)
  })

  // here we get a movie by id
  app.get('/movies/:id', (req, res, next) => {
    repo.getMovieById(req.params.id).then(movie => {
      res.status(status.OK).json(movie)
    }).catch(next)
  })
}