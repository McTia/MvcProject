using Microsoft.Data.Sqlite;
using MvcProject.Models.Repo.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MvcProject.Models.Repo
{
    public class CourseRepo : ICourseRepo
    {
        public int AddCourse(string cmd)
        {
            int affectedRows = 0;
            try
            {
                using var conn = new SqliteConnection("Data Source=Data/data.db");
                conn.Open();
                using SqliteCommand ins = new SqliteCommand(cmd, conn);
                affectedRows = ins.ExecuteNonQuery();               
            }
            catch (Exception exc)
            {
                throw new Exception($"Errore - {exc}");
            }

            return affectedRows;
        }
        public DataSet GetAllCourses(string query)
        {
            var dataSet = new DataSet();
            var dataTable = new DataTable();
            try
            {
                using var conn = new SqliteConnection("Data Source=Data/data.db");
                conn.Open();
                using var cmd = new SqliteCommand(query, conn);
                using var reader = cmd.ExecuteReader();                
                dataSet.EnforceConstraints = false;
                dataSet.Tables.Add(dataTable);
                dataTable.Load(reader);
            }            
            catch (Exception exc)
            {
                throw new Exception($"Errore - {exc}");
            }

            return dataSet;
        }

        public int RemoveCourse(string cmd)
        {
            int affectedRows = 0;
            try
            {
                using var conn = new SqliteConnection("Data Source=Data/data.db");
                conn.Open();
                using SqliteCommand ins = new SqliteCommand(cmd, conn);
                affectedRows = ins.ExecuteNonQuery();
            }
            catch (Exception exc)
            {
                throw new Exception($"Errore - {exc}");
            }

            return affectedRows;
        }
    }
}
