using Microsoft.AspNetCore.Mvc;

namespace ResumeProProject.Server.Controllers
{
    public class ResumeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
