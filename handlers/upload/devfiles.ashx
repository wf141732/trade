<%@ WebHandler Language="VB" Class="devfiles" %>

Imports System
Imports System.Web

Public Class devfiles : Implements IHttpHandler
    
    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        ' 上传测试设备文档
        Dim id As String = context.Request.Form("id")
        Dim t As String = context.Request.Form("t")
        Dim f As HttpPostedFile = context.Request.Files("Filedata")
        Dim new_filename As String = id + "_" + HttpUtility.UrlDecode(f.FileName, Encoding.GetEncoding("UTF-8"))

        Dim url As String = "../../upload/dev/"
        Dim rootPhy As String = context.Request.MapPath(url) ' 物理根目录
        Dim sp As New aac.SqlProcedure("up_tst_dev_uploadfiles")
        Dim a(0 To 2) As String
        a(0) = id
        a(1) = new_filename
        a(2) = t
        sp.callPro(a)
        sp = Nothing
        
        Dim file As String = rootPhy + new_filename
        If My.Computer.FileSystem.FileExists(file) Then My.Computer.FileSystem.DeleteFile(file)
        f.SaveAs(file)
        context.Response.ContentType = "text/plain"
        context.Response.Write(new_filename)
    End Sub
 
    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class