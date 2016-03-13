using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;

namespace PhantomJS.WS
{
    public partial class PhantomJSWS : ServiceBase
    {

         private int ProcessId;

         public PhantomJSWS()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            var phantomexe = ConfigurationManager.AppSettings["PathToPhantom"].ToString();
            var phantomScript = ConfigurationManager.AppSettings["PhantomScript"].ToString();
            var phantomPort = ConfigurationManager.AppSettings["PhantomPort"].ToString();
            var localHost = ConfigurationManager.AppSettings["LocalHost"].ToString();
            var phantomLogLocation = ConfigurationManager.AppSettings["PhantomLogLocation"].ToString();
            var createSnapShout = ConfigurationManager.AppSettings["CreateSnapshoots"].ToString();
            var sanpshootLocation = ConfigurationManager.AppSettings["SanpshootLocation"].ToString();

            var process = new System.Diagnostics.Process();
            process.StartInfo = new System.Diagnostics.ProcessStartInfo(phantomexe);
            process.StartInfo.Arguments = string.Format("{0} {1} {2} {3} {4} {5}", phantomScript, phantomPort, localHost, phantomLogLocation, createSnapShout, sanpshootLocation);
            process.StartInfo.CreateNoWindow = true;
            process.StartInfo.ErrorDialog = false;
            process.StartInfo.RedirectStandardError = true;
            process.StartInfo.RedirectStandardInput = true;
            process.StartInfo.RedirectStandardOutput = true;
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden;
            var isok = process.Start();
            ProcessId = process.Id;
        }

        protected override void OnStop()
        {
            if (ProcessId > 0)
            {
                Process p = Process.GetProcessById(ProcessId);
                p.Kill();
            }
        }

    }
}
