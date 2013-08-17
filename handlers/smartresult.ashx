<%@ WebHandler Language="C#" Class="smartresult" %>

using System;
using System.Web;
using System.Net;
using System.Text;
public class smartresult : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        string phone = context.Request.QueryString.Get("phone");
        string pageHtml = "";
        try
        {
            WebClient MyWebClient = new WebClient();

            MyWebClient.Credentials = CredentialCache.DefaultCredentials;//获取或设置用于对向Internet资源的请求进行身份验证的网络凭据。

            Byte[] pageData = MyWebClient.DownloadData("http://www.youdao.com/smartresult-xml/search.s?type=mobile&q="+phone);//从指定网站下载数据

            pageHtml = Encoding.Default.GetString(pageData);  //如果获取网站页面采用的是GB2312，则使用这句             

            //string pageHtml = Encoding.UTF8.GetString(pageData); //如果获取网站页面采用的是UTF-8，则使用这句

  
        }
        catch (WebException webEx)
        {
            Console.WriteLine(webEx.Message.ToString());
        }
        context.Response.Write(pageHtml);
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}