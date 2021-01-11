using MvcProject.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcProject.Models.Services.Interfaces
{
    public interface ICourseService
    {
        int AddCourse(CourseViewModel model);
        List<CourseViewModel> GetAllCourses();
        int RemoveCourse(CourseViewModel model);
    }
}
