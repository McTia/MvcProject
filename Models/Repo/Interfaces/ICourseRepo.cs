using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MvcProject.Models.Repo.Interfaces
{
    public interface ICourseRepo
    {
        int AddCourse(string cmd);
        DataSet GetAllCourses(string query);
        int RemoveCourse(string cmd);
    }
}
