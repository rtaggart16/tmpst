using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using tmpst.Models;

namespace tmpst.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApixuConfiguration _config;
        private readonly AllEarthquakeModels _earthquakeConfig;
        private readonly PopulationAPIUrl _populationConfig;
        private readonly TrafficAPIKeys _trafficConfig;
        private readonly GoogleMapsKey _maps;
        private readonly MapQuestKeys _mapQuest;
        private readonly UserSecretCollection _allSecrets;

        public HomeController(IOptions<ApixuConfiguration> config, IOptions<EarthquakeHourlyUrls> hourly, IOptions<EarthquakeDailyUrls> daily,
            IOptions<EarthquakeWeeklyUrls> weekly, IOptions<EarthquakeMonthlyUrls> monthly, IOptions<PopulationAPIUrl> population,
            IOptions<TrafficAPIKeys> traffic, IOptions<GoogleMapsKey> maps, IOptions<MapQuestKeys> mapQuest)
        {
            _config = config.Value;
            _earthquakeConfig = new AllEarthquakeModels
            {
                HourlyUrls = hourly.Value,
                DailyUrls = daily.Value,
                WeeklyUrls = weekly.Value,
                MonthlyUrls = monthly.Value
            };
            _populationConfig = population.Value;
            _trafficConfig = traffic.Value;
            _maps = maps.Value;
            _mapQuest = mapQuest.Value;

            _allSecrets = new UserSecretCollection
            {
                Apixu = _config,
                Population = _populationConfig,
                Earthquakes = _earthquakeConfig,
                Traffic = _trafficConfig,
                Maps = _maps,
                MapQuest = _mapQuest
            };
        }

        public IActionResult Index()
        {
            return View(_allSecrets);
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
