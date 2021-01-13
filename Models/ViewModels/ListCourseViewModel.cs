using System;
using System.Collections.Generic;
using System.Linq;

namespace MvcProject.Models.ViewModels
{
    public class ListCourseViewModel
    {
        public List<CourseViewModel> CourseList { get; set; }
        public int Count { get; set; }
        public int TotalCourseDuration
        {
            get => CourseList?.Sum(l => l.Duration) ?? 0;
        }
    }
}
