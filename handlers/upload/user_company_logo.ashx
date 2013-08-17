<%@ WebHandler Language="VB" Class="user_company_logo" %>

Imports System
Imports System.Web

Public Class user_company_logo : Implements IHttpHandler
    
    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        '上传注册公司logo
        Dim id As String = context.Request.Form("id")
        Dim sVirPath As String = "~/upload/logo/"
        Dim sPath As String = context.Request.MapPath(sVirPath) + id + ".jpg"
        Dim sLocalFileName As String = context.Request.Files(0).FileName
        context.Request.Files(0).SaveAs(String.Format(sPath))
        
        'ID,文件名,类型,dir,日期
        context.Response.ContentType = "text/plain"
        context.Response.Write("success")
    End Sub
 
    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class