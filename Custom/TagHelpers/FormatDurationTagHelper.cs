using Microsoft.AspNetCore.Razor.TagHelpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MvcProject.Custom.TagHelpers
{  
    public class FormatDurationTagHelper : TagHelper
    {
        // sorta di model binding per recuperare il value dall'attributo value html 
        // (siccome sto passando il modello in index.cshtml proprio tramite attributo value)
        public int Value { get; set; } 
        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            if(Value > 0)
            {
                if(Value > 60)
                {
                    TimeSpan convertValue = TimeSpan.FromMinutes(Value);
                    string formatValue = convertValue.ToString("hh'h 'mm'min'");
                    output.Content.AppendHtml("<p style='color:red'>La durata totale dei corsi è: " + formatValue + "</p>");
                }
                else
                    output.Content.AppendHtml("<p style='color:green'>La durata totale dei corsi è: " + Value + "min </p>");
            }
        }
    }
}
