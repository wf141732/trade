<%@ WebHandler Language="C#" Class="test" %>

using System;
using System.Web;

public class test : IHttpHandler {
    
    public void ProcessRequest (HttpContext context) {
        context.Response.ContentType = "text/plain";
        
        string formGet = context.Request.Form["name"];
        string getGet = context.Request.QueryString["name"];

        string retStr = "";
        if (formGet != null)
        {
            retStr = "Get data from form:"+formGet+";";
        }
        if (getGet != null)
        {
            retStr += "Get data from get:" + getGet+";";
        }
        if (retStr == "")
        {
            retStr = "No data!";
        }
        context.Response.Write(retStr);
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}