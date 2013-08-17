<%@ WebHandler Language="C#" Class="upload" %>

using System;
using System.Web;
using System.IO;
using System.Runtime.Serialization.Json;
using Aaccess.DB;
using System.Collections;
using System.Configuration;
using System.Collections.Generic;
using System.Text;
using AacImageResize;

public class upload : IHttpHandler {
    public void ProcessRequest (HttpContext context) {
        string type = context.Request.QueryString["type"];
        string para = context.Request.QueryString["para"];
        string filename=context.Request.QueryString["filename"];
        if (string.IsNullOrEmpty(type)) {
            type = context.Request.Form["type"];
            filename = context.Request.Form["filename"];
        }
        
        
        string sPath = context.Request.MapPath("~\\upload\\pi\\template\\");
        string sPicRoot = context.Request.MapPath("~\\upload\\");
        HttpPostedFile file = null;
        string sExt = "";
        if (context.Request.Files.Count > 0)
        {
            file = context.Request.Files[0];
            sExt = Com.GetFileExt(filename);
           
        }

        string s = "";
        switch (type)
        {
            case "pic":// 销售图片
                s = UploadPic(para, file, filename, sExt, sPicRoot);
                break;
            case "popi":// 上传PO/PI文档
                s = UploadPoPi(para, file, sExt, context.Request.MapPath("~/PoFaxCopy/"));
                break;
            case "BillOrder":// 
                s = UploadBillOrder(para, file, sExt, context.Request.MapPath("~/upload/billorder/"));
                break;                
            case "pitemplate"://上传pi模板
                s = UploadPITemplate(para, file, sExt, sPath);
                break;
            case "bbsattach":
                s = UploadBBSAttach(para, file, context.Request.MapPath("~/upload/bbsatt/" + para + "/"));
                break;
            case "userphoto":
                UploadUserPhoto(para, file, context.Request.MapPath("~/upload/userphoto/"));
                break;
            case "socket":
                UploadSocketPhoto(para, file, context.Request.MapPath("~/upload/socket/"));
                break;
            default:
                break;
        }
        context.Response.ContentType = "text/plain";
        context.Response.Write(s);
    }

    private string UploadSocketPhoto(string socketId, HttpPostedFile f, string rootPhy)
    {
        string s = "";
        try
        {
            Aaccess.DB.CommonProcedure proc = new CommonProcedure();
            object[] p = new object[] { socketId };
            var oReturn = proc.GetTableValue("up_refurbish_addSocketPic", p, 1);
            object[] row0 = (object[])oReturn[0];
            string id = row0[0].ToString();

            string file = rootPhy + "o/" + id + ".jpg";
            string f300 = rootPhy + "300/" + id + ".jpg";
            if (System.IO.File.Exists(file))
            {
                System.IO.File.Delete(file);
            }
            if (System.IO.File.Exists(f300))
            {
                System.IO.File.Delete(f300);
            }

            f.SaveAs(file);
            ImageTools.ResizeImage(file, f300, 300, 300, true, 80);
            s = "300/" + id + ".jpg";
        }
        catch (Exception exp)
        {
            s = "err" + exp.ToString();
        }

        return s;
    }

    private string UploadUserPhoto(string userid, HttpPostedFile f, string rootPhy)
    {
        string s = "";
        try
        {
            string file = rootPhy + "o/" + userid + ".jpg";
            string f60 = rootPhy + "60x60/" + userid + ".jpg";
            string f128 = rootPhy + "128/" + userid + ".jpg";
            if (System.IO.File.Exists(file))
            {
                System.IO.File.Delete(file);
            }
            if (System.IO.File.Exists(f60))
            {
                System.IO.File.Delete(f60);
            }
            if (System.IO.File.Exists(f128))
            {
                System.IO.File.Delete(f128);
            }

            f.SaveAs(file);

            ImageTools.ResizeImage(file, f60, 60, 60, true, 80);
            ImageTools.ResizeImage(file, f128, 128, 128, true, 80);
        }
        catch (Exception exp)
        {
            s = "err" + exp.ToString();
        }

        return s;
    }
    
        
    private string UploadPic(string para, HttpPostedFile file,string strFileName, string strExtName, string sRoot)
    {
        string s = "";
        try
        {
            //DataContractJsonSerializer js = new DataContractJsonSerializer(typeof(UploadPic));
            //MemoryStream ms = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(para));
            //UploadPic pic = (UploadPic)js.ReadObject(ms);

            //Aaccess.DB.CommonProcedure proc = new CommonProcedure();
            //object[] p = new object[] {pic.rtype, pic.rid, pic.pn, pic.clssid, pic.desc, pic.dcid, pic.uid, strExtName };

            //var oReturn = proc.GetTableValue("up_pic_upload", p, 1);

            //object[] row0 = (object[])oReturn[0];
            //string strFileName = row0[0].ToString();
           // string strPnId = row0[1].ToString();


            string strOriPath = sRoot + @"item\";
            //string strSmallPath = sRoot + @"s\" + strPnId + @"\";
            //string strLargePath = sRoot + @"l\" + strPnId + @"\";
            //Directory.CreateDirectory(strOriPath);//该方法会自动检查目录是否存在，如果已存在，则不创建
            //Directory.CreateDirectory(strSmallPath);
            Directory.CreateDirectory(strOriPath);

            string strOriFile = strOriPath + strFileName;
            file.SaveAs(strOriFile);

            //ImageTools.ResizeImage(strOriFile, strSmallPath + strFileName, 250, 250, true, 80);
            //ImageTools.ResizeImage(strOriFile, strLargePath + strFileName, 600, 600, true, 80);

            s = "\\upload\\item\\" + strFileName;
        }
        catch (Exception exp)
        {
            s = "err" + exp.ToString();
        }

        return s;
    }
    
    
    /// <summary>
    /// 上传BBS附件
    /// </summary>
    private string UploadBBSAttach(string para, HttpPostedFile file, string sFolder)
    {
        string sPath = "";
        try
        {
            string fn = file.FileName;
            sPath = sFolder + fn;
            Aaccess.DB.CommonProcedure proc = new CommonProcedure();
            object[] p = new object[] { para, fn };
            proc.GetReturnVale("up_bbs_add_attach", p, 1).ToString();

            Directory.CreateDirectory(sFolder);
            file.SaveAs(sPath);
        }
        catch (Exception exp)
        {
            sPath = "err" + exp.ToString();
        }
        return sPath;
    }
    
    /// <summary>
    /// 上传PI模板
    /// </summary>
    private string UploadPITemplate(string para, HttpPostedFile file, string strExtName, string strFolder)
    {
        string strReturn = "";
        try
        {
            DataContractJsonSerializer js = new DataContractJsonSerializer(typeof(PITemplate));
            MemoryStream ms = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(para));
            PITemplate pi = (PITemplate)js.ReadObject(ms);

            Aaccess.DB.CommonProcedure proc = new CommonProcedure();
            object[] p = new object[] { pi.PtId, file.FileName, strExtName, pi.UId };
            strReturn = proc.GetReturnVale("up_po_insertPITemplate", p, 1).ToString();
            file.SaveAs(strFolder + strReturn + "." + strExtName);
        }
        catch (Exception exp)
        {
            strReturn = "err" + exp.ToString();
        }
        return strReturn;
    }


    private string UploadPoPi(string para, HttpPostedFile file, string strExtName, string sRoot)
    {
        string s = "";
        try
        {
            DataContractJsonSerializer js = new DataContractJsonSerializer(typeof(UploadPoPi));
            MemoryStream ms = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(para));
            UploadPoPi popi = (UploadPoPi)js.ReadObject(ms);            

            Aaccess.DB.CommonProcedure proc = new CommonProcedure();
            object[] p = new object[] { popi.poid, popi.type, strExtName };
            var oReturn = proc.GetTableValue("up_po_addPOPIFile", p, 1);
            object[] row0 = (object[])oReturn[0];
            string sFileName = row0[1].ToString();

            sRoot += popi.poid + "\\";
            Directory.CreateDirectory(sRoot);//该方法会自动检查目录是否存在，如果已存在，则不创建
            sRoot+= sFileName;
            //D:\upload\PoFaxCopy\0\1_46372.gif
            file.SaveAs(sRoot);
            s = "ppf" + sRoot;// ppf popi file
        }
        catch (Exception exp)
        {
            s = "err" + exp.ToString();
        }
        return s;
    }

    /// <summary>
    /// 上传财务单据
    /// </summary>
    /// <param name="para"></param>
    /// <param name="file"></param>
    /// <param name="strExtName"></param>
    /// <param name="sRoot"></param>
    /// <returns></returns>
    private string UploadBillOrder(string para, HttpPostedFile file, string strExtName, string sRoot)
    {
        string s = "";
        try
        {
            DataContractJsonSerializer js = new DataContractJsonSerializer(typeof(UploadOrder));
            MemoryStream ms = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(para));
            UploadOrder order = (UploadOrder)js.ReadObject(ms);            

            string fileDir = sRoot +"/"+order.OrderType+ "/" + order.OrderID + "/";
            Directory.CreateDirectory(fileDir);

            file.SaveAs(fileDir+file.FileName);

            Aaccess.DB.CommonProcedure proc = new CommonProcedure();
            object retID = proc.GetReturnVale("up_f_updateBillDocs", new object[] { order.OrderID, order.Uid, file.FileName, order.OrderType }, 1);
        }
        catch (Exception exp)
        {
            s = "err" + exp.ToString();
        }
        return s;
    }
    

    
    public bool IsReusable {
        get {
            return false;
        }
    }

}