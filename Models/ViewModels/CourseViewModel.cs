using MvcProject.Models.Entities;

public class CourseViewModel
    {
        public int Id { get; set; }
        public string Author { get; set; }
        public string Name { get; set; }
        public int Duration { get; set; }

        public static CourseViewModel FromEntity(Course course)
        {
            return new CourseViewModel {
                Id = course.Id,
                Author = course.Author,
                Name = course.Name,
                Duration = course.Duration
            };
        }
    }