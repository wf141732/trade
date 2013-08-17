<%@ WebHandler Language="VB" Class="package_out" %>

Imports System
Imports System.Web

Public Class package_out : Implements IHttpHandler
    
    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        ' 上传芯片图片
        Dim pid As String = context.Request.Form("pid")
        Dim f As HttpPostedFile = context.Request.Files("Filedata")
        Dim url As String = "../../upload/packageout/"
        Dim rootPhy As String = context.Request.MapPath(url) ' 物理根目录
        Dim aStr() As String = Split(f.FileName, ".")
        Dim sExtend As String = aStr(aStr.GetUpperBound(0)) ' file extend
        Dim o As New GeneralMethod
        Dim a(0 To 3) As String
        a(0) = pid
        a(1) = sExtend
        a(2) = HttpUtility.UrlDecode(context.Request.Form("comment"), Encoding.GetEncoding("UTF-8"))
        a(3) = context.Request.Form("uid")
        Dim id As String = o.callProc_with_value(a, "up_package_update_picsOuter")
        o = Nothing
        Dim file As String = rootPhy + id + "." + sExtend
        If My.Computer.FileSystem.FileExists(file) Then
            My.Computer.FileSystem.DeleteFile(file)
        End If
        f.SaveAs(file)
        context.Response.ContentType = "text/plain"
        context.Response.Write(sExtend)
    End Sub
 
    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class