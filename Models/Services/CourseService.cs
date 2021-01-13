using MvcProject.Models.Repo.Interfaces;
using MvcProject.Models.Services.Interfaces;
using MvcProject.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.Data;

namespace MvcProject.Models.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepo _courseRepo;

        public CourseService(ICourseRepo courseRepo)
        {
            _courseRepo = courseRepo;
        }

        public int AddCourse(CourseViewModel model)
        {
            var cmd = $"INSERT INTO Courses (Author, CourseName, Duration) VALUES('{model.Author}', '{model.Name}', {model.Duration});";
            var insResult = _courseRepo.AddCourse(cmd);

            return insResult;

        }

        public ListCourseViewModel GetAllCourses(int offset)
        {
            var query = $@"SELECT Id, Author, CourseName, Duration FROM Courses ORDER BY CourseName LIMIT 10 OFFSET {offset};
                        SELECT COUNT(*) FROM Courses;";
            DataSet dataSet = _courseRepo.GetAllCourses(query);
            var dataTable = dataSet.Tables[0];
            var courseList = new List<CourseViewModel>();

            foreach (DataRow row in dataTable.Rows)
            {
                var course = CourseViewModel.FromDataRow(row);
                courseList.Add(course);
            }

            var result = new ListCourseViewModel
            {
                CourseList = courseList,
                Count = Convert.ToInt32(dataSet.Tables[1].Rows[0][0])
            };

            return result;

        }

        public int RemoveCourse(CourseViewModel model)
        {
            var cmd = $"DELETE FROM Courses WHERE Id = {model.Id};";
            var delResult = _courseRepo.RemoveCourse(cmd);

            return delResult;

        }

        public int UpdateCourse(CourseViewModel model)
        {
            var cmd = $"UPDATE Courses SET Author = '{model.Author}', CourseName = '{model.Name}', Duration = '{model.Duration}' WHERE Id = {model.Id};";
            var upResult = _courseRepo.UpdateCourse(cmd);

            return upResult;
        }
    }
}
