using MvcProject.Models.Services.Interfaces;
using System;
using System.Collections.Generic;

namespace MvcProject.Models.Services
{
    public class CourseService : ICourseService
    {
        public List<CourseViewModel> GetAllCourses()
        {
            var courseList = new List<CourseViewModel>();
            var rand = new Random();
            for (int i = 1; i <= 20; i++)
            {
                var course = new CourseViewModel
                {
                    Id = i,
                    Name = $"Corso {i}",
                    Author = "Mario Rossi",
                    Duration = rand.Next(1,20) * 10
                };
                courseList.Add(course);
            }
            
            return courseList;
        }
    }
}
