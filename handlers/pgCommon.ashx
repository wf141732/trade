﻿<%@ WebHandler Language="C#" Class="pgCommon" %>

using System;
using System.Web;
using Npgsql;
using NpgsqlTypes;
using System.Dynamic;
using System.Collections.Generic;
using Aaccess.DB;
using System.Runtime.Serialization.Json;
using System.IO;
using AacImageResize;
using System.Drawing;
using System.Xml;
using System.Collections.Generic;

public class pgCommon : IHttpHandler
{    
    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        string operationCode = context.Request.Form["OperationCode"];
        string operationData = context.Request.Form["OperationData"];
        string returnStr = "";
        if (operationCode == null)
        {
            operationCode = context.Request.QueryString["OperationCode"];
            operationData = context.Request.QueryString["OperationData"];
        }

        string sPath = context.Request.MapPath("~\\upload\\item\\");
        string sqlfile = context.Request.MapPath("~/oesql.xml");//在linux下面需要改成这样 在win下面也可以
        if (!string.IsNullOrEmpty(operationCode))
        {
            DataContractJsonSerializer js = new DataContractJsonSerializer(typeof(CommonParameter));
            MemoryStream ms = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(operationData));
            CommonParameter cp = (CommonParameter)js.ReadObject(ms);
            switch (operationCode)
            {
                case "query":
                    returnStr = getData(cp,sPath,sqlfile);
                    break;
                case "batchUpdate":
                    returnStr = batchUpdate(cp,sqlfile);
                    break;
                default:
                    break;
            }
        }
        string callbackFunName = context.Request["callbackparam"];
        if (string.IsNullOrEmpty(callbackFunName))
        {
            context.Response.Write(returnStr);
        }
        else
        {
            context.Response.Write(callbackFunName + "(" + returnStr + ")");
        }
    }

    private string batchUpdate(CommonParameter cp,string sqlfile)
    {
        string dbcon = System.Configuration.ConfigurationManager.ConnectionStrings["oeConnectionString"].ToString();
        dbcon= String.Format(dbcon, cp.ConField);
        string msg = "";
        using (NpgsqlConnection conn = new NpgsqlConnection(dbcon))
        {
            conn.Open();
            NpgsqlTransaction tr = conn.BeginTransaction();
            try
            {
                NpgsqlCommand comm = new NpgsqlCommand();
                comm.Connection = conn;
                comm.Transaction = tr;
                string sql = "";
                for (int i = 0, l = cp.BatchValues.Length; i < l; i++)
                {

                    sql = string.Format(getSQL(cp.ObjectName, sqlfile), (object[])cp.BatchValues[i]);
                    comm.CommandText = sql;
                    comm.ExecuteNonQuery();
                }

                tr.Commit();
            }
            catch (Exception e)
            {
                tr.Rollback();
                msg = e.Message;
            }
        }
        JsonOutputParameters jsop = new JsonOutputParameters();
        if (msg != "")
            jsop.ErrorMessage = msg;
        else jsop.ISSuccess = 1;
        return jsop.Json();
    }


    private string getData(CommonParameter cp,string sPath,string sqlfile)
    {
        string dbcon = System.Configuration.ConfigurationManager.ConnectionStrings["oeConnectionString"].ToString();
        dbcon = String.Format(dbcon, cp.ConField);
        List<object[]> table = new List<object[]>();
        object[] pars = cp.Values;
        string sql = string.Format(getSQL(cp.ObjectName,sqlfile), pars);
        using (NpgsqlConnection conn = new NpgsqlConnection(dbcon))
        {
            NpgsqlCommand comm = new NpgsqlCommand();
            comm.Connection = conn;
            conn.Open();
            comm.CommandText = sql;
            comm.CommandTimeout = 60;
            NpgsqlDataReader dr = comm.ExecuteReader();
           
            int fc = -1;
            while (dr.Read())
            {
                if (fc == -1)
                {
                    fc = dr.FieldCount;
                };
                var r = new object[fc];
                for (int i = 0; i < fc; i++)
                {
                    //if (dr[i].GetType().IsArray)
                    //{
                    //    Byte[] img = (Byte[])dr[i];

                    //    FileStream fs = new FileStream(sPath+"b.jpg", FileMode.Create, FileAccess.Write);


                    //    BinaryWriter bw = new BinaryWriter(new BufferedStream(fs));

                    //    bw.Write(img);

                    //    bw.Flush();

                    //    fs.Close();
                    //    //string imgName= BitmapHelper.md5(img);
                    //    //string fileName=sPath + imgName + ".jpg";
                    //    //if (!File.Exists(fileName))
                    //    //{
                            
                    //    //    Bitmap bit= BitmapHelper.BytesToBitmap(img);
                    //    //    Image image= BitmapHelper.Resize(bit, 300, 200);
                    //    //    image.Save(fileName);
                    //    //} 
                    //}
                    //else
                    //{
                        r[i] = (dr[i] == DBNull.Value) ? "" : dr[i];
                    //}
                }
                table.Add(r);
            }
        }
        JsonOutputParameters jsop = new JsonOutputParameters(table.ToArray());
        
        return jsop.Json();
    }

    private string getSQL(string code,string sqlfile)
    {
        string sql = "";
        switch (code)
        {
            case "product"://,pp.product_image
                sql = "select pp.id,pt.name,pt.list_price,pp.name_template,u.name as uname " +
                    "from product_product pp,product_template pt,product_uom u  " +
                    "where pp.product_tmpl_id=pt.id and sale_ok='t' and pt.type='product' and u.id=pt.uom_id and categ_id={0};";
                break;
            case "partner":
                sql = "select id,name,comment from res_partner where customer='t' and active='t' and lang='zh_CN';";
                break;
            case "user-cus-info"://获取用户关联的客户的信息
                sql = "select u.id,u.partner_id,p.name,u.name as uname from res_users u left join res_partner p on p.id=u.partner_id and customer='t' and lang='zh_CN' where u.login='{0}'";
                break;
            case "a-analytic"://辅助核算类别
                sql = "select id,name,code,discont from account_analytic_account where type='normal' and state='open'";
                break;
            case "a-partner":
                sql = "select id,name,comment from res_partner where customer='t' and active='t' and lang='zh_CN' and name like '%{0}%';";
                break;
            case "category"://获取客户下面的产品类别
                sql = "select id,name from product_category as pc,product_category_partner_rel as pcp where pcp.category_id=pc.id and pcp.partner_id={0};";
                break;
            case "createSoHead"://创建销售订单头
                sql = "insert into sale_order(create_uid,create_date,picking_policy,order_policy,shop_id,date_order,partner_id,note,amount_untaxed,company_id,state,pricelist_id" +
                        " ,partner_order_id,partner_invoice_id,user_id,amount_total,name,partner_shipping_id,shipped,invoice_quantity,amount_tax,project_id)" +
                       // " select u.id,now(),'direct','prepaid',1,now(),p.id,'{2}',{1},1,'draft',1," +
                        " select u.id,now(),'direct',"+
                            //"(select COALESCE(max(replace(replace(value,'''',''),'S','')),'prepaid') as a from ir_values where key='default' and key2='partner_id='||'{0}' and name='order_policy') as a"+
                            "(select COALESCE(max(substring(value for position('''' in value)-1)),'prepaid') from (select substring(value from position('''' in value)+1 ) as value from ir_values where key='default' and key2='partner_id='||'{0}' and name='order_policy') as b) as a" +
                            ",1,now(),p.id,'{2}',{1},1,'draft',1," +
                        " pa.id,pa.id,p.user_id,{1},'SO' || cast(nextval('ir_sequence_029') as varchar(10)),pa.id,'f','order',0.00,{3}" +
                        " from res_partner p left join res_users u on u.partner_id=p.id left join res_partner_address pa" +
                        " on pa.partner_id=p.id and pa.active='t' where p.id={0} order by pa.id desc limit 1;" +//{0]是客户 {1}是总价 {2}是备注
                        " insert into wkf_instance(wkf_id,uid,res_id,res_type,state) values(6,1,currval('sale_order_id_seq'),'sale.order','active');" +
                        "insert into wkf_workitem(act_id,inst_id,state) values(34,currval('wkf_instance_id_seq'),'complete');select currval('sale_order_id_seq');";
                break;
            case "createSoLine":
                sql = "insert into sale_order_line(create_uid,create_date,product_uos_qty,discount,product_uom,sequence,order_id,price_unit,product_uom_qty,invoiced,delay,name,company_id," +
                    " salesman_id,state,product_id,order_partner_id,th_weight,type)" +
                    " select so.create_uid,so.create_date,{2},{3},pt.uom_id,10,so.id,pt.list_price,{2},'f',7,'['||pp.default_code||']'||pt.name,1,so.create_uid,'draft',pp.id,partner_order_id,pt.weight_net,'make_to_stock'" +
                    " from sale_order so,product_template pt,product_product pp " +
                    "where pp.product_tmpl_id=pt.id and so.id={0} and pp.id={1};";//{0}是销售单头 {1}是物料ID {2}订单行数量
                break;
            case "soHead"://查询销售订单头
                sql = "select so.id,so.name,date_order,amount_total,date_confirm,(select sum(m.product_qty) from stock_move m,sale_order_line l where m.id=m.id and m.state='done' and m.sale_line_id=l.id and l.order_id=so.id)/" +
                    "(select sum(sm.product_qty) from stock_move sm,sale_order_line ol where sm.sale_line_id=ol.id and ol.order_id=so.id) as shipped,ss.name as shopName,to_char(date_order,'mm-dd'),to_char(date_confirm,'mm-dd') from sale_order so,sale_shop ss where ss.id=so.shop_id and so.partner_id={0} and {1} order by so.name desc;";//state
                break;
            case "soHeadDetail":
                sql = "select so.id,ss.name as shopName,date_order,amount_untaxed from sale_order so,sale_shop ss where ss.id=so.shop_id and so.id={0}";
                break;
            case "soLineDetail":
                sql = "select sol.id,pp.name_template,sol.product_uom_qty,price_unit,pu.name as uName,discount,product_uom_qty*price_unit*(100-COALESCE(discount,100))/100 as amount from sale_order_line sol,product_category pc,product_product pp,product_uom pu,product_template pt " +
                    "where pc.id=pt.categ_id and pt.id=pp.product_tmpl_id and sol.product_id=pp.id and sol.product_uom=pu.id and sol.order_id={0}";
                break;
            case "stockMove"://获取发货信息1
                sql = "select sm.id,sm.origin,pt.name as productName,pc.name as categName," +
                    "product_qty,pu.name as uname,ol.price_unit*COALESCE(discount,100)/100 as price_unit,sm.date,'',pc.id as categID,pp.id as productID,sm.sale_line_id " +
                    " from stock_move sm,product_product pp,product_template pt,product_category pc,product_uom pu,sale_order_line ol " +
                    " where sm.partner_id={0} and sm.state='done' and pp.id=sm.product_id and pp.product_tmpl_id=pt.id " +
                    " and pc.id=pt.categ_id and sm.move_dest_id is null and pu.id=pt.uom_id and ol.id=sale_line_id";
                break;
            case "confirmStockMove"://经销商确认收货
                sql = "update stock_move set move_dest_id={1},x_customer_in={2} where id={1}";
                break;
            case "zpye-"://赠品余额
                sql = "select aaa.code,av.partner_id,rp.name as partner_name,av.number,av.id,av.date,coalesce(av.x_money,0.00) as x_money,null as x_sale_money "+
                      "  from account_voucher av,account_analytic_account aaa,res_partner rp "+
                      "  where av.analytic_id=aaa.id "+
                      "    and av.partner_id=rp.id "+
                      "    and av.partner_id={0} " +
                      " and av.state='posted' "+
                      //"    and aaa.code='HZP' "+
                      "  union all "+
                        " select aaa.code,so.partner_id,rp.name as partner_name,so.name,so.id,so.date_confirm,null as x_money,so.amount_total as  x_sale_money "+
                         " from sale_order so,res_partner rp,account_analytic_account aaa "+
                         " where so.partner_id=rp.id "+
                         "   and so.partner_id={0} " +
                          " and aaa.id=so.project_id "+
                          " and aaa.code='ZP';";
                break;
            case "zpye1"://所有客户的赠品余额
                sql = "select '' as code, partner_id,partner_name,'' as number,null as id,'' as date,sum(COALESCE(x_money,0)),sum(COALESCE(x_sale_money,0)) from (" +
                        "select aaa.code,av.partner_id,rp.name as partner_name,av.number,av.id,av.date,coalesce(av.x_money,0.00) as x_money,null as x_sale_money " +
                      "  from account_voucher av,account_analytic_account aaa,res_partner rp " +
                      "  where av.analytic_id=aaa.id " +
                      "    and av.partner_id=rp.id " +
                      " and av.state='posted' " +
                      //"    and aaa.code='HZP' " +
                      "  union all " +
                        " select aaa.code,so.partner_id,rp.name as partner_name,so.name,so.id,so.date_confirm,null as x_money,so.amount_total as  x_sale_money " +
                         " from sale_order so,res_partner rp,account_analytic_account aaa " +
                         " where so.partner_id=rp.id " +
                          " and aaa.id=so.project_id " +
                          " and aaa.code='ZP'"+
                          "   ) as a group by partner_id,partner_name ;";
                break;
            case "pzSearch1"://凭证查询
                sql = "select am.id,am.name,am.ref,to_char(am.date,'YYYY/MM/DD') as date,ap.name,aj.name,(select sum(debit) from account_move_line where move_id=am.id),balance,proof,ru.name as uname,am.period_id,am.journal_id "+
                    " ,aml.name,aa.name,aml.credit,aml.debit ,aa.code,aa.level,aap.name,am.to_check,uru.name" +
                    " from account_move as am left join res_users as uru on uru.id=am.write_uid,account_period as ap,account_journal as aj,res_users as ru ," +
                    " account_move_line aml,account_account aa,account_account aap" +
                        " where ru.id=am.create_uid and ap.id=am.period_id and aj.id=am.journal_id and aml.move_id=am.id and aa.id=aml.account_id and aa.parent_id=aap.id and am.journal_id<>9 "+
                        " order by am.id desc,aml.debit desc limit {1} offset {0} ;";
                break;
            case "pzLine1"://凭证行
                sql = "select aml.id,aml.name,aa.code,aa.name as aname,aap.name as pname,debit,credit,aaa.name as aname,aap.level,aa.id,aaa.id "+
                      " from account_move_line as aml left join account_analytic_account aaa on aml.analytic_account_id=aaa.id "+
                        ",account_account as aa,account_account aap "+
                        " where aml.account_id=aa.id and aa.parent_id=aap.id and aml.move_id={0} order by aml.debit desc;";
                break;
            case "pzInsertHead1"://添加凭证头
                sql = "insert into account_move(id,create_uid,create_date,name,state,company_id,journal_id,period_id,date,to_check,proof) "+
                        "values(nextval('account_move_id_seq'),{1},now(),'{2}','draft',1,{3},{4},'{5}','f',{6});"+
                        " update ir_sequence set number_next=number_next+number_increment where id=(select sequence_id from account_journal where upper(code)= 'HAND'); " +
                        "select currval('account_move_id_seq');";
                break;
            case "pzUpdateHead"://凭证头
                sql = "update account_move set period_id={4},date='{5}',proof={6},name='{2}' where id={0};"+
                    " update ir_sequence set number_next=number_next+number_increment where id={7}; " +
                    "select {0}";
                break;
            case "pzUpdateLine"://更新凭证行
                sql = "update account_move_line set account_id={2},analytic_account_id={4},name='{7}',debit={9},credit={10} where id={0};";
                break;
            case "pzInsertLine1"://添加凭证行
                sql = "insert into account_move_line(id,create_uid,create_date,account_id,journal_id,blocked,analytic_account_id,credit,centralisation,company_id,state,debit,period_id,date_created,date,move_id,name)"
			           + " values(nextval('account_move_line_id_seq'),{1},now(),{2},{3},'f',{4},{10},'normal',1,'draft',{9},{1},now(),now(),{6},'{7}');";
                break;
            case "a-account1"://智能提示科目
                sql = "select aa.id, aa.code,aa.name as aname,aap.name as pname,aap.level " +
                      " from account_account as aa,account_account as aap " +
                        " where aa.parent_id=aap.id and (aa.code like '{0}%' or aa.name like '%{0}%' or aap.name like '%{0}%') limit 30;";
                break;
            case "pzCode1"://凭证号
                sql = "select replace(replace(replace(replace(i.prefix, '%(year)s', to_char(now(),'YYYY')),'%(y)s',to_char(now(),'YY')),'%(month)s',to_char(now(),'MM')),'%(day)s',to_char(now(),'DD'))||"+
                        "lpad(cast(i.number_next as varchar(10)),i.padding,'0'),to_char(now(),'YYYY/MM/DD'),ap.id,ap.name,aj.id,i.id " +
                        "from account_journal aj,ir_sequence i,account_period ap where ap.date_start<=date_trunc('day',now()) and ap.date_stop>=date_trunc('day',now()) and ap.state='draft' and i.id=aj.sequence_id and upper(aj.code)= 'HAND'";
                break;
            case "a-pzPeriod1"://凭证会计期间
                sql = "select ap.id,ap.name from account_period ap where ap.special='f' and ap.name like '%{0}%' order by ap.date_start desc";
                break;            
            default:
                sql = SQL.GetSQL(code,sqlfile);
                break;
        }
        return sql;
    }
    
    

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }
    
    

}

public static class BitmapHelper
{
    public static Bitmap BytesToBitmap(Byte[] Bytes)
    {
        MemoryStream stream = null;
        try
        {
            stream = new MemoryStream(Bytes);
            return new Bitmap((Image)new Bitmap(stream));
        }
        catch (ArgumentNullException ex)
        {
            throw ex;
        }
        catch (ArgumentException ex)
        {
            throw ex;
        }
        finally
        {
            stream.Close();
        }
    }

    public static byte[] BitmapToBytes(Bitmap Bitmap)
    {
        MemoryStream ms = null;
        try
        {
            ms = new MemoryStream();
            Bitmap.Save(ms, Bitmap.RawFormat);
            byte[] byteImage = new Byte[ms.Length];
            byteImage = ms.ToArray();
            return byteImage;
        }
        catch (ArgumentNullException ex)
        {
            throw ex;
        }
        finally
        {
            ms.Close();
        }
    }

    public static Image Resize(Bitmap srcBmp, int resizedW, int resizedH)
    {        
        //create a new Bitmap the size of the new image
        Bitmap bmp = new Bitmap(resizedW, resizedH);
        //create a new graphic from the Bitmap
        Graphics graphic = Graphics.FromImage((Image)bmp);
        graphic.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
        //draw the newly resized image
        graphic.DrawImage((Image)srcBmp, 0, 0, resizedW, resizedH);
        //dispose and free up the resources
        graphic.Dispose();
        //return the image
        return (Image)bmp;
    }

    public static string md5(Byte[] src)
    {
        System.Security.Cryptography.MD5 m = new System.Security.Cryptography.MD5CryptoServiceProvider();
        byte[] s = m.ComputeHash(src);
        return BitConverter.ToString(s);
    }
}


public class SQL
{
    static DateTime fieledate = new DateTime(2000, 1, 1);
    static System.Collections.Generic.Dictionary<string, string> Dic = new System.Collections.Generic.Dictionary<string, string>();

    public static string GetSQL(string name, string filename)
    {
        System.IO.FileInfo file = new System.IO.FileInfo(filename);
        if (file.LastWriteTime > fieledate)
        {
            Dic.Clear();
            System.Xml.XmlDocument doc = new XmlDocument();
            doc.Load(filename);
            XmlNodeList sqls = doc.GetElementsByTagName("sql");
            string sname = "";
            string value = "";
            for (int i = 0; i < sqls.Count; i++)
            {
                XmlNode sql = sqls[i];
                sname=sql.Attributes["name"].Value;
                XmlCDataSection cd = sql.FirstChild as XmlCDataSection;
                //sql.InnerText.Replace("\r", " ").Replace("\n", " ")
                value = cd.Value.Replace("\t", " ").Replace("\r", " ").Replace("\n", " ");
                if(Dic.ContainsKey(sname))
                    Dic[sname]=value;
                else
                    Dic.Add(sname,value );
            }
            fieledate = file.LastWriteTime;
        }
        //throw new Exception(Dic.Keys.Count.ToString());
        //return "select 1,2,3,4";
       return Dic[name]; ;
    }
}