﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcProject.Models.Services.Interfaces
{
    public interface ICourseService
    {
        List<CourseViewModel> GetAllCourses();
    }
}