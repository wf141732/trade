Imports System.Web
Imports System.Web.Services
Imports System.Web.Services.Protocols
Imports MailBee
Imports MailBee.Mime
Imports MailBee.SmtpMail

' To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line.
' <System.Web.Script.Services.ScriptService()> _
<WebService(Namespace:="http://tempuri.org/")> _
<WebServiceBinding(ConformsTo:=WsiProfiles.BasicProfile1_1)> _
<Global.Microsoft.VisualBasic.CompilerServices.DesignerGenerated()> _
Public Class send_mail
     Inherits System.Web.Services.WebService

    '<WebMethod()> _
    'Public Function sendMail() As String
    '    Dim err As String = "success"
    '    Try
    '        ' Set MailBee.NET license key.
    '        ' Create Smtp object.
    '        Dim mailer As Smtp = New Smtp
    '        ' Set message headers.
    '        mailer.Message.From.AsString = "hwmfly@qq.com"
    '        mailer.Message.To.AsString = "aaccess@126.com"
    '        mailer.Message.Subject = "test subject"
    '        mailer.Message.BodyHtmlText = "aaa"
    '        mailer.SmtpServers.Add("smtp.qq.com", "hwmfly", "000425")
    '        mailer.Send()
    '        mailer = Nothing
    '    Catch ex As MailBeeException
    '        err = ex.Message
    '    End Try
    '    Return err
    'End Function

End Class
