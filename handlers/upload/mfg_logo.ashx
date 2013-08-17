<%@ WebHandler Language="VB" Class="mfg_logo" %>

Imports System
Imports System.Web
Imports gVar

Public Class mfg_logo : Implements IHttpHandler
    
    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        ' 上传芯片图片
        Dim id As String = context.Request.Form("id")
        Dim f As HttpPostedFile = context.Request.Files("Filedata")
        Dim new_filename As String = id + "_" + f.FileName
        
        Dim url As String = "../../upload/mfglogo/"
        Dim rootPhy As String = context.Request.MapPath(url) ' 物理根目录
        'up_mfg_uploadlogo
        Dim sp As New aac.SqlProcedure("up_mfg_uploadlogo")
        Dim a(0 To 1) As String
        a(0) = id
        a(1) = new_filename
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