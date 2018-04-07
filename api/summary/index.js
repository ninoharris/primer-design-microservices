import asyncHandler from 'express-async-handler'
import _ from 'lodash'
import db from '../../firebase'

/*
 ** @return Array cohortExercises
*/
export const getCohortExercises = async (cohortID = '') => {
  const cohortExercises = await db.ref(`cohorts/${cohortID}/exerciseIDs`)
    .once('value').then(snapshot => Object.keys(snapshot.val()))
  // console.log('Cohort exercises:', cohortID)

  return cohortExercises
  
}

export const getStudentSummary = async (studentID, cohortExerciseCount = null) => {

  const student = await db.ref(`students/${studentID}`).once('value').then(snapshot => snapshot.val())
  
  if(!student) return null

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

export const getCohortStudentSummaries = async (cohortID) => {
  const cohort = await db.ref(`cohorts/${cohortID}`).once('value').then(snapshot => snapshot.val())

  const cohortExercisesCount = Object.keys(cohort.exerciseIDs).length
  
  const studentIDs = Object.keys(cohort.studentIDs)
  
  const studentSummaries = await Promise.all(studentIDs.map( async(studentID) => { 
      const summary = await getStudentSummary(studentID, cohortExercisesCount) 
      return {
        studentID,
        summary,
      }
    }
  ))
  console.log('studentSummaries', studentSummaries)
  // const studentSummaries = studentSummariesArray.reduce(
  //   (obj, {studentID, summary }) => ({...obj, [studentID]: summary})
  // , {})
  
  return studentSummaries
}

export const getCohortSummary = async (cohortID) => {
  const studentSummaries = await getCohortStudentSummaries(cohortID)
  console.log('studentSummaries', studentSummaries)
  const completedCount = studentSummaries.filter(student => student.summary.unfinishedCount === 0 && student.summary.notStartedCount === 0).length
  const attemptedCount = studentSummaries.filter(student => student.summary.notStartedCount !== 0).length
  const notStartedCount = studentSummaries.filter(student => {
    return student.summary.unfinishedCount === 0 && student.summary.completedCount === 0
  }).length
  const unfinishedCount = attemptedCount - completedCount
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

  app.get('/summary/students/byID/:studentID', asyncHandler(async (req, res, next) => {
    const studentID = req.params.studentID
    const summary = await getStudentSummary(studentID)
    res.status(200).json(summary)

    // res.status(200).json({ Hello: "world!"})
  }))
  app.get('/summary/students/byCohortID/:cohortID', asyncHandler(async (req, res, next) => {
    const cohortID = req.params.cohortID
    const summary = await getCohortStudentSummaries(cohortID)
    res.status(200).json(summary)
  }))

  app.get('/summary/cohorts/:cohortID', asyncHandler(async (req, res, next) => {
    const cohortID = req.params.cohortID
    const data = await getCohortSummary(cohortID)
    res.status(200).json(data)
  }))

}