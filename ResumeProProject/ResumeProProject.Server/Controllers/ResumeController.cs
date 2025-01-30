//using Microsoft.AspNetCore.Mvc;
//using System.Diagnostics;
//using Microsoft.EntityFrameworkCore;
//using ResumeProProject.Server.Data.Models;
//using ResumeProProject.Server.Data;
//using Microsoft.AspNetCore.Mvc;

//namespace ResumeProProject.Server.Controllers
//{
//    [ApiController]
//    [Route("/api/[controller]")]
//    public class ResumeController(AppDbContext dbContext) : Controller
//    {
//        private readonly ILogger<ResumeController> _logger;
//        private readonly AppDbContext _db = dbContext;



//        [HttpPost("Create")]
//        public async Task<IActionResult> CreateResume([FromBody] Resume resume)
//        {
//            var NewResume = new Resume
//            {
//                Name = resume.Name,
//                UpdatedDateTime = resume.UpdatedDateTime,
//                UserId = resume.UserId
                
//            }; 
//            _db.Resumes.Add(NewResume);
//            await _db.SaveChangesAsync();

//            //var NewGeneralInformation = new GeneralInformation
//            //{
//            //    ResumeId = NewResume.ResumeId,
//            //    FirstName = generalInformation.FirstName,
//            //    MiddleName = generalInformation.MiddleName,
//            //    LastName = generalInformation.LastName,
//            //    Email = generalInformation.Email,
//            //    PhoneNumber = generalInformation.PhoneNumber,
//            //    WebsiteUrl = generalInformation.WebsiteUrl,
//            //    LinkedInUrl = generalInformation.LinkedInUrl,
//            //    GitHubUrl = generalInformation.GitHubUrl

//            //};
//            //_db.GeneralInformation.Add(NewGeneralInformation);
//            //await _db.SaveChangesAsync();

//            return Ok();
//        }


//    }
//}
