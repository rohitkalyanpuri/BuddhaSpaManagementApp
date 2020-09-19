

using System;
using System.Collections.Generic;
using System.Text;

namespace BuddhaRelaxSpaApp.Repository.CommonHelper
{

    public static class CommonImageUrl
    {


        public static string GetProfileImageUrl(string Host,string ContentRootPath,string Gender, string ProfileImg)
        {
            string Url = string.Empty;
            string BaseUrl = "http://"+ Host + "/ProfileImage/";
            

            if (!string.IsNullOrEmpty(ProfileImg)){
                Url = BaseUrl + ProfileImg;
            }
            else
            {
                if(Gender == "Male") 
                    Url = BaseUrl+"Male.png";
                else
                    Url = BaseUrl+"Female.png";
            }
            return Url;
        }
    }
}
