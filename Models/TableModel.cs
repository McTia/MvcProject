using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcProject.Models
{
    public enum CRUD_ACTION { create, read, update, delete }
    public class Columns
    {
        public string data { get; set; }
        public string searchable { get; set; }
        public string orderable { get; set; }
        public Dictionary<string, string> search;
    }

    public class ColOrder : Dictionary<string, string>
    {
        public string column
        {
            get
            {
                return this["column"];
            }
        }

        public int columnIndex
        {
            get
            {
                string _column = this["column"];
                int retval = 0;
                int.TryParse(_column, out retval);
                return retval;
            }
        }
        public string dir
        {
            get
            {
                return this["dir"];
            }
        }
        public bool asc
        {
            get
            {
                return this["dir"] == "asc";
            }
        }
    }

    public class TableQuery
    {
        public int Id { get; set; }

        /// <summary>
        /// Draw counter
        /// </summary>
        public int draw { get; set; }

        /// <summary>
        /// Paging first record indicator
        /// </summary>
        public int start { get; set; }

        /// <summary>
        /// Number of records that the table can display in the current draw
        /// </summary>
        public int length { get; set; }
    }

    [Serializable]
    public class TableInput : TableQuery
    {
        public int IDClinic { get; set; }
        /// <summary>
        /// The table that use the result data list
        /// </summary>
        public string TableList { get; set; }

        public Dictionary<string, string> search { get; set; }
        public ColOrder[] order { get; set; }
        public Columns[] columns { get; set; }

        public string CultureInfo { get; set; }
    }
}
