using MvcProject.Models.ViewModels;


namespace MvcProject.Models.Services.Interfaces
{
    public interface ICourseService
    {
        int AddCourse(CourseViewModel model);
        ListCourseViewModel GetAllCourses(int offset);
        int RemoveCourse(CourseViewModel model);
        int UpdateCourse(CourseViewModel model);
    }
}
