using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace tmpst.Models
{
    /*
       Author Info:

       Name(s) - Ross Taggart
       Student Number - S1828840
       Date Created - 17/02/2019
       Version - 1.0.0

       Description:
       Class that contains all the models which map to the secrets.json file
     */

    /// <summary>
    /// Model which contains all the information of all the APIs
    /// </summary>
    public class UserSecretCollection
    {
        public ApixuConfiguration Apixu { get; set; }
        public AllEarthquakeModels Earthquakes { get; set; }
        public PopulationAPIUrl Population { get; set; }
        public TrafficAPIKeys Traffic { get; set; }
        public GoogleMapsKey Maps { get; set; }
        public MapQuestKeys MapQuest { get; set; }
    }

    /// <summary>
    /// Class which contains the API key required to communicate with the APIXU API
    /// </summary>
    public class ApixuConfiguration
    {
        public string API_Key { get; set; }
    }

    /// <summary>
    /// Class which contains all of the Earthquake API URLs
    /// </summary>
    public class AllEarthquakeModels
    {
        public EarthquakeHourlyUrls HourlyUrls { get; set; }
        public EarthquakeDailyUrls DailyUrls { get; set; }
        public EarthquakeWeeklyUrls WeeklyUrls { get; set; }
        public EarthquakeMonthlyUrls MonthlyUrls { get; set; }
    }

    /// <summary>
    /// Class which contains all of the hourly Earthquake API URLs
    /// </summary>
    public class EarthquakeHourlyUrls
    {
        public string Significant_Quakes { get; set; }
        public string Magnitude_Four_Point_Five { get; set; }
        public string Magnitude_Two_Point_Five { get; set; }
        public string Magnitude_One { get; set; }
        public string All_Earthquakes { get; set; }
    }

    /// <summary>
    /// Class which contains all of the daily Earthquake API URLs
    /// </summary>
    public class EarthquakeDailyUrls
    {
        public string Significant_Quakes { get; set; }
        public string Magnitude_Four_Point_Five { get; set; }
        public string Magnitude_Two_Point_Five { get; set; }
        public string Magnitude_One { get; set; }
        public string All_Earthquakes { get; set; }
    }

    /// <summary>
    /// Class which contains all of the weekly Earthquake API URLs
    /// </summary>
    public class EarthquakeWeeklyUrls
    {
        public string Significant_Quakes { get; set; }
        public string Magnitude_Four_Point_Five { get; set; }
        public string Magnitude_Two_Point_Five { get; set; }
        public string Magnitude_One { get; set; }
        public string All_Earthquakes { get; set; }
    }

    /// <summary>
    /// Class which contains all of the monthly Earthquake API URLs
    /// </summary>
    public class EarthquakeMonthlyUrls
    {
        public string Significant_Quakes { get; set; }
        public string Magnitude_Four_Point_Five { get; set; }
        public string Magnitude_Two_Point_Five { get; set; }
        public string Magnitude_One { get; set; }
        public string All_Earthquakes { get; set; }
    }

    /// <summary>
    /// Class which contains the base URL for the Population API
    /// </summary>
    public class PopulationAPIUrl
    {
        public string Base_Url { get; set; }
    }

    /// <summary>
    /// Class which contains the App ID and the App Code of the Traffic API
    /// </summary>
    public class TrafficAPIKeys
    {
        public string App_ID { get; set; }
        public string App_Code { get; set; }
    }

    /// <summary>
    /// Class which contains the API key of the google map
    /// </summary>
    public class GoogleMapsKey
    {
        public string Api_Key { get; set; }
    }

    /// <summary>
    /// Class which contains the Consumer Key and Secret for MapQuest
    /// </summary>
    public class MapQuestKeys
    {
        public string Consumer_Key { get; set; }
        public string Consumer_Secret { get; set; }
    }
}
