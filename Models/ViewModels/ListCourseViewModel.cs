using System.Collections.Generic;

namespace MvcProject.Models.ViewModels
{
    public class ListCourseViewModel
    {
        public List<CourseViewModel> CourseList { get; set; }
        public int Count { get; set; }
    }
}
