using MvcProject.Models.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;

namespace MvcProject.Models.ViewModels
{
    public class CourseViewModel
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Campo obbligatorio")]
        public string Author { get; set; }
        [Required(ErrorMessage = "Campo obbligatorio")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Campo obbligatorio")]
        [Range(1, int.MaxValue, ErrorMessage = "La durata deve essere maggiore di 0")]
        public int Duration { get; set; }

        public static CourseViewModel FromDataRow(DataRow row)
        {
            var courseViewModel = new CourseViewModel
            {
                Id = Convert.ToInt32(row["Id"]),
                Author = Convert.ToString(row["Author"]),
                Name = Convert.ToString(row["CourseName"]),
                Duration = Convert.ToInt32(row["Duration"])
            };

            return courseViewModel;
        }
    }
}