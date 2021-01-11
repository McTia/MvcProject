using MvcProject.Models.Repo.Interfaces;
using MvcProject.Models.Services.Interfaces;
using MvcProject.Models.ViewModel;
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

        public List<CourseViewModel> GetAllCourses()
        {
            var query = $"SELECT Id, Author, CourseName, Duration FROM Courses";
            DataSet dataSet = _courseRepo.GetAllCourses(query);
            var dataTable = dataSet.Tables[0];
            var courseList = new List<CourseViewModel>();

            foreach (DataRow row in dataTable.Rows)
            {
                var course = CourseViewModel.FromDataRow(row);
                courseList.Add(course);
            }
            return courseList;

        }

        public int RemoveCourse(CourseViewModel model)
        {
            var cmd = $"DELETE FROM Courses WHERE Id = {model.Id};";
            var delResult = _courseRepo.RemoveCourse(cmd);

            return delResult;

        }
    }
}
