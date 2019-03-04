using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using tmpst.Data;
using tmpst.Models;
using tmpst.Services;

namespace tmpst
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            // Add application services.
            services.AddTransient<IEmailSender, EmailSender>();

            services.AddMvc();

            // Secrets
            services.Configure<ApixuConfiguration>(Configuration.GetSection("ApixuKey"));
            services.Configure<EarthquakeHourlyUrls>(Configuration.GetSection("EarthquakeHourlyUrls"));
            services.Configure<EarthquakeDailyUrls>(Configuration.GetSection("EarthquakeDailyUrls"));
            services.Configure<EarthquakeWeeklyUrls>(Configuration.GetSection("EarthquakeWeeklyUrls"));
            services.Configure<EarthquakeMonthlyUrls>(Configuration.GetSection("EarthquakeMonthlyUrls"));
            services.Configure<PopulationAPIUrl>(Configuration.GetSection("PopulationAPIUrl"));
            services.Configure<TrafficAPIKeys>(Configuration.GetSection("TrafficAPIKeys"));
            services.Configure<MapQuestKeys>(Configuration.GetSection("MapQuestKeys"));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseBrowserLink();
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
