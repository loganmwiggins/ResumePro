using Microsoft.AspNetCore.Mvc;

namespace ResumeProProject.Server.Controllers
{
    public class TemplateController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
