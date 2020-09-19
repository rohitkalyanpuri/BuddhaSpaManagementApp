using QRCoder;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace BuddhaRelaxSpaApp.Utility
{
    public static class GeneralHelper
    {
        public const string MatchEmailPattern = @"^[\w!#$%&'*+\-/=?\^_`{|}~]+(\.[\w!#$%&'*+\-/=?\^_`{|}~]+)*"
            + "@"
            + @"((([\-\w]+\.)+[a-zA-Z]{2,4})|(([0-9]{1,3}\.){3}[0-9]{1,3}))\z";

        public static Byte[] BitmapToBytes(Bitmap img)
        {
            using (MemoryStream stream = new MemoryStream())
            {
                img.Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                return stream.ToArray();
            }
        }
        public static string RandomNumber()
        {
            Random generator = new Random();
            return generator.Next(0, 999999).ToString("D6");
        }
        public static string QRCodeBase64String(string qrText)
        {
            try
            {
                QRCodeGenerator qrGenerator = new QRCodeGenerator();
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(qrText,
                QRCodeGenerator.ECCLevel.Q);
                QRCode qrCode = new QRCode(qrCodeData);
                Bitmap qrCodeImage = qrCode.GetGraphic(20);
                Byte[] bytes = GeneralHelper.BitmapToBytes(qrCodeImage);
                string base64String = Convert.ToBase64String(bytes, 0, bytes.Length);
                return base64String;
            }
            catch (Exception ex)
            {
                return string.Empty; ;
            }
        }
        //IntegerExtensions
        public static int ParseInt(this string value, int defaultIntValue = 0)
        {
            int parsedInt;
            if (int.TryParse(value, out parsedInt))
            {
                return parsedInt;
            }

            return defaultIntValue;
        }

        public static int? ParseNullableInt(this string value)
        {
            if (string.IsNullOrEmpty(value))
                return null;

            return value.ParseInt();
        }

        public static int ExtIndexOf(this string value, string strToCheck)
        {
            int index = 0;
            try
            {
                index = value.IndexOf(strToCheck, StringComparison.OrdinalIgnoreCase);
            }
            catch (Exception ex)
            {

            }
            return index;
        }

        public static bool IsValidEmail(string email)
        {
            try
            {
                if (email != null) return Regex.IsMatch(email, MatchEmailPattern);
                else return false;
            }
            catch
            {
                return false;
            }
        }

        public static string GetValidDate(string ReqStringDate, string DateFormat = "MM/dd/yyyy")
        {
            string MonthDayYearFormat = string.Empty;
            try
            {
                DateTime d;
                bool chValidity = DateTime.TryParse(ReqStringDate, out d);
                if (chValidity)
                {
                    MonthDayYearFormat = Convert.ToDateTime(ReqStringDate).ToString(DateFormat);
                }

            }
            catch (Exception ex)
            {
                MonthDayYearFormat = string.Empty;
            }
            return MonthDayYearFormat;
        }

        public static string ListToString<T>(this List<T> self, string delim = ",")
        {
            try
            {
                return string.Join(delim, self);
            }
            catch (Exception ex)
            {
                return "";
            }

        }
        /// <summary>
        /// Generates a random password based on the rules passed in the parameters
        /// </summary>
        /// <param name="includeLowercase">Bool to say if lowercase are required</param>
        /// <param name="includeUppercase">Bool to say if uppercase are required</param>
        /// <param name="includeNumeric">Bool to say if numerics are required</param>
        /// <param name="includeSpecial">Bool to say if special characters are required</param>
        /// <param name="includeSpaces">Bool to say if spaces are required</param>
        /// <param name="lengthOfPassword">Length of password required. Should be between 8 and 128</param>
        /// <returns></returns>
        public static string GeneratePassword(bool includeLowercase, bool includeUppercase, bool includeNumeric, bool includeSpecial, bool includeSpaces, int lengthOfPassword)
        {
            const int MAXIMUM_IDENTICAL_CONSECUTIVE_CHARS = 2;
            const string LOWERCASE_CHARACTERS = "abcdefghijklmnopqrstuvwxyz";
            const string UPPERCASE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string NUMERIC_CHARACTERS = "0123456789";
            const string SPECIAL_CHARACTERS = @"!#$%&*@\";
            const string SPACE_CHARACTER = " ";
            const int PASSWORD_LENGTH_MIN = 8;
            const int PASSWORD_LENGTH_MAX = 128;

            if (lengthOfPassword < PASSWORD_LENGTH_MIN || lengthOfPassword > PASSWORD_LENGTH_MAX)
            {
                return "Password length must be between 8 and 128.";
            }

            string characterSet = "";

            if (includeLowercase)
            {
                characterSet += LOWERCASE_CHARACTERS;
            }

            if (includeUppercase)
            {
                characterSet += UPPERCASE_CHARACTERS;
            }

            if (includeNumeric)
            {
                characterSet += NUMERIC_CHARACTERS;
            }

            if (includeSpecial)
            {
                characterSet += SPECIAL_CHARACTERS;
            }

            if (includeSpaces)
            {
                characterSet += SPACE_CHARACTER;
            }

            char[] password = new char[lengthOfPassword];
            int characterSetLength = characterSet.Length;

            System.Random random = new System.Random();
            for (int characterPosition = 0; characterPosition < lengthOfPassword; characterPosition++)
            {
                password[characterPosition] = characterSet[random.Next(characterSetLength - 1)];

                bool moreThanTwoIdenticalInARow =
                    characterPosition > MAXIMUM_IDENTICAL_CONSECUTIVE_CHARS
                    && password[characterPosition] == password[characterPosition - 1]
                    && password[characterPosition - 1] == password[characterPosition - 2];

                if (moreThanTwoIdenticalInARow)
                {
                    characterPosition--;
                }
            }

            return string.Join(null, password);
        }

        /// <summary>
        /// Checks if the password created is valid
        /// </summary>
        /// <param name="includeLowercase">Bool to say if lowercase are required</param>
        /// <param name="includeUppercase">Bool to say if uppercase are required</param>
        /// <param name="includeNumeric">Bool to say if numerics are required</param>
        /// <param name="includeSpecial">Bool to say if special characters are required</param>
        /// <param name="includeSpaces">Bool to say if spaces are required</param>
        /// <param name="password">Generated password</param>
        /// <returns>True or False to say if the password is valid or not</returns>
        public static bool PasswordIsValid(bool includeLowercase, bool includeUppercase, bool includeNumeric, bool includeSpecial, bool includeSpaces, string password)
        {
            const string REGEX_LOWERCASE = @"[a-z]";
            const string REGEX_UPPERCASE = @"[A-Z]";
            const string REGEX_NUMERIC = @"[\d]";
            const string REGEX_SPECIAL = @"([!#$%&*@\\])+";
            const string REGEX_SPACE = @"([ ])+";

            bool lowerCaseIsValid = !includeLowercase || (includeLowercase && Regex.IsMatch(password, REGEX_LOWERCASE));
            bool upperCaseIsValid = !includeUppercase || (includeUppercase && Regex.IsMatch(password, REGEX_UPPERCASE));
            bool numericIsValid = !includeNumeric || (includeNumeric && Regex.IsMatch(password, REGEX_NUMERIC));
            bool symbolsAreValid = !includeSpecial || (includeSpecial && Regex.IsMatch(password, REGEX_SPECIAL));
            bool spacesAreValid = !includeSpaces || (includeSpaces && Regex.IsMatch(password, REGEX_SPACE));

            return lowerCaseIsValid && upperCaseIsValid && numericIsValid && symbolsAreValid && spacesAreValid;
        }

        public static string InvoiceTemplate(long InvoiceNumber
            ,string ClientName
            ,string ClientAddress
            , decimal Amount
            , DateTime CreatedDate
            ,string PaymentMode,string CompanyLogo,string item="Spa/Massage")
        {
            string template= @"<div  style='max - width:800px; margin - top:auto; margin - bottom:auto; margin - right:auto; margin - left:auto; padding - top:30px; padding - bottom:30px; padding - right:30px; padding - left:30px; border - width:1px; border - style:solid; border - color:#eee;box-shadow:0 0 10px rgba(0, 0, 0, .15);font-size:16px;line-height:24px;font-family:'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;color:#555;'> <table cellpadding='0' cellspacing='0' style='width:100%;line-height:inherit;text-align:left;'> <tr> <td colspan='2' style='padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px;vertical-align:top;'> <table style='width:100%;line-height:inherit;text-align:left;'> <tr> <td class='title' style='padding-top:5px;padding-right:5px;padding-left:5px;vertical-align:top;padding-bottom:20px;font-size:45px;line-height:45px;color:#333;'> <img src='{CompanyLogo}' style='width:100%;max-width:300px;'> </td><td style='padding-top:5px;padding-right:5px;padding-left:5px;vertical-align:top;padding-bottom:20px;'> Invoice #:{InvoiceNumber}<br>Created:{CreatedDate}</td></tr></table> </td></tr><tr > <td colspan='2' style='padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px;vertical-align:top;'> <table style='width:100%;line-height:inherit;text-align:left;'> <tr> <td style='padding-top:5px;padding-right:5px;padding-left:5px;vertical-align:top;padding-bottom:40px;'> Buddha Relax Spa<br>Jodhpur<br>Rajasthan </td><td style='padding-top:5px;padding-right:5px;padding-left:5px;vertical-align:top;padding-bottom:40px;'>{ClientName}<br>{ClientAddres}<br></td></tr></table> </td></tr><tr > <td style='padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px;vertical-align:top;background-color:#eee;background-image:none;background-repeat:repeat;background-position:top left;background-attachment:scroll;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#ddd;font-weight:bold;'> Payment Method </td><td style='padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px;vertical-align:top;background-color:#eee;background-image:none;background-repeat:repeat;background-position:top left;background-attachment:scroll;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#ddd;font-weight:bold;'> </td></tr><tr > <td style='padding-top:5px;padding-right:5px;padding-left:5px;vertical-align:top;padding-bottom:20px;'>{PaymentMode}</td><td style='padding-top:5px;padding-right:5px;padding-left:5px;vertical-align:top;padding-bottom:20px;'>{Amount}</td></tr><tr > <td style='padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px;vertical-align:top;background-color:#eee;background-image:none;background-repeat:repeat;background-position:top left;background-attachment:scroll;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#ddd;font-weight:bold;'> Item </td><td style='padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px;vertical-align:top;background-color:#eee;background-image:none;background-repeat:repeat;background-position:top left;background-attachment:scroll;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#ddd;font-weight:bold;'> Price </td></tr><tr> <td style='padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px;vertical-align:top;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#eee;'>{itemName}</td><td style='padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px;vertical-align:top;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#eee;'> ₹{Amount}</td></tr><tr> <td style='padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px;vertical-align:top;'></td><td style='padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px;vertical-align:top;'> Total: ₹{Amount}</td></tr></table></div>";

            template = template.Replace("{CompanyLogo}", CompanyLogo.ToString());
            template = template.Replace("{InvoiceNumber}", InvoiceNumber.ToString());
            template = template.Replace("{CreatedDate}", CreatedDate.ToString("dd-MM-yyyy"));
            template = template.Replace("{ClientName}", ClientName);
            template = template.Replace("{ClientAddres}", ClientAddress);
            template = template.Replace("{PaymentMode}", PaymentMode);
            template = template.Replace("{Amount}", Amount.ToString());
            template = template.Replace("{itemName}", item);

            return template;

        }

        public static bool HtmlToPdfSaveLocation(string html, string pdfpath, bool Landscape = false)
        {
            try
            {
                #region SelectPDF
                string htmlString = html;
                string pdf_page_size = "A4";
                SelectPdf.PdfPageSize pageSize = (SelectPdf.PdfPageSize)Enum.Parse(typeof(SelectPdf.PdfPageSize),
                    pdf_page_size, true);
                string pdf_orientation = "Portrait";
                SelectPdf.PdfPageOrientation pdfOrientation =
                    (SelectPdf.PdfPageOrientation)Enum.Parse(typeof(SelectPdf.PdfPageOrientation),
                    pdf_orientation, true);

                int webPageWidth = 794;
                int webPageHeight = 1123;
                SelectPdf.HtmlToPdf converter = new SelectPdf.HtmlToPdf();
                // set converter options
                converter.Options.PdfPageSize = pageSize;
                converter.Options.PdfPageOrientation = pdfOrientation;
                converter.Options.WebPageWidth = webPageWidth;
                converter.Options.WebPageHeight = webPageHeight;
                converter.Options.MarginLeft = 35;
                converter.Options.MarginTop = 50;
                converter.Options.MarginRight = 35;
                converter.Options.MarginBottom = 35;
                converter.Options.AutoFitWidth = SelectPdf.HtmlToPdfPageFitMode.AutoFit;
                converter.Options.AutoFitHeight = SelectPdf.HtmlToPdfPageFitMode.NoAdjustment;


                // create a new pdf document converting an url
                SelectPdf.PdfDocument doc = converter.ConvertHtmlString(htmlString);
                doc.Save(pdfpath);
                doc.Close();



                return true;
                #endregion
            }
            catch (Exception ex)
            {
                
                return false;
            }

        }

        public static string encrypt(string encryptString)
        {
            string EncryptionKey = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            byte[] clearBytes = Encoding.Unicode.GetBytes(encryptString);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] {
            0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76
            });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                        cs.Close();
                    }
                    encryptString = Convert.ToBase64String(ms.ToArray());
                }
            }
            return encryptString;
        }

        public static string Decrypt(string cipherText)
        {
            string EncryptionKey = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            cipherText = cipherText.Replace(" ", "+");
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] {
            0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76
            });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(cipherBytes, 0, cipherBytes.Length);
                        cs.Close();
                    }
                    cipherText = Encoding.Unicode.GetString(ms.ToArray());
                }
            }
            return cipherText;
        }
        public static void SendEmail(string Subject, string Body, string ToEmail, string FromEmail = "app@homekeepoc.com", string DisplayName = null, string logoPath = null)
        {
            MailMessage mail = new MailMessage();
            SmtpClient SmtpServer = new SmtpClient("EmailOneSMTPServer", 587);
            SmtpServer.EnableSsl = true;

            if (!string.IsNullOrEmpty(DisplayName))
                mail.From = new MailAddress(FromEmail, DisplayName);
            else
                mail.From = new MailAddress(FromEmail, "FromEmailAddress");

            mail.To.Add(ToEmail);
            mail.Subject = Subject;
            mail.Body = Body;
            mail.IsBodyHtml = true;

            SmtpServer.DeliveryMethod = SmtpDeliveryMethod.Network;
            SmtpServer.UseDefaultCredentials = false;
            SmtpServer.Credentials = new System.Net.NetworkCredential(FromEmail, "password");

            SmtpServer.Send(mail);


        }


    }
}
