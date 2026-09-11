# Run: BROWSER_BIN=/path/to/chromium python3 tests/browser.py
# Uses only Python standard library; serves under a subpath like GitHub Pages.
import socket,base64,os,struct,json,subprocess,time,urllib.request,threading,http.server,functools,tempfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
handler=functools.partial(http.server.SimpleHTTPRequestHandler,directory=str(root.parent))
server=http.server.ThreadingHTTPServer(('127.0.0.1',8766),handler)
threading.Thread(target=server.serve_forever,daemon=True).start()
profile=tempfile.mkdtemp(prefix='chinese-browser-')
browser=subprocess.Popen([os.environ.get('BROWSER_BIN', '/opt/brave.com/brave/brave'),'--headless','--no-sandbox','--disable-gpu','--remote-debugging-port=9227','--remote-allow-origins=*','--user-data-dir='+profile,'about:blank'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
try:
 for _ in range(100):
  try:
   pages=json.load(urllib.request.urlopen('http://127.0.0.1:9227/json'));break
  except Exception:time.sleep(.1)
 url=next(p['webSocketDebuggerUrl'] for p in pages if p['type']=='page')
 path=url.split('9227')[1];sock=socket.create_connection(('127.0.0.1',9227));nonce=base64.b64encode(os.urandom(16)).decode()
 sock.sendall(f'GET {path} HTTP/1.1\r\nHost: 127.0.0.1:9227\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {nonce}\r\nSec-WebSocket-Version: 13\r\n\r\n'.encode())
 response=b''
 while b'\r\n\r\n' not in response:response+=sock.recv(1)
 assert b'101' in response,response
 def recv(n):
  out=b''
  while len(out)<n:out+=sock.recv(n-len(out))
  return out
 counter=0
 def command(method,params={}):
  global counter
  counter+=1;ident=counter
  message=json.dumps({'id':ident,'method':method,'params':params}).encode();mask=os.urandom(4)
  header=bytes([129,128|len(message)]) if len(message)<126 else bytes([129,254])+struct.pack('!H',len(message))
  sock.sendall(header+mask+bytes(b^mask[i%4] for i,b in enumerate(message)))
  while True:
   head=recv(2);length=head[1]&127
   if length==126:length=struct.unpack('!H',recv(2))[0]
   if length==127:length=struct.unpack('!Q',recv(8))[0]
   obj=json.loads(recv(length))
   if obj.get('id')==ident:
    if 'error' in obj:raise RuntimeError(obj)
    return obj.get('result',{})
 def js(expression):
  r=command('Runtime.evaluate',{'expression':expression,'awaitPromise':True,'returnByValue':True})
  if 'exceptionDetails' in r:raise RuntimeError(r)
  return r.get('result',{}).get('value')
 def check(expression,message):
  assert js(expression),message
  print('PASS:',message,flush=True)
 def settle():time.sleep(.2)
 command('Page.enable');command('Runtime.enable')
 command('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':True})
 command('Page.navigate',{'url':'http://127.0.0.1:8766/'+root.name+'/chinese-radicals.html'})
 for _ in range(50):
  try:
   if js("typeof offlineReady!=='undefined' && offlineReady"):break
  except Exception:pass
  time.sleep(.1)
 check("storageOK && offlineReady && content.length===232",'IndexedDB and offline cache initialized')
 check("document.documentElement.scrollWidth<=innerWidth",'390px study screen has no horizontal overflow')
 check("document.querySelector('#smart-start')!==null && document.body.textContent.toLowerCase().includes('matching')",'smart lesson is offered with three exercise forms')
 js("startSmart()");settle()
 check("data.session.kind==='guided' && ['intro','flash','quiz','match'].every(mode=>data.session.steps.some(step=>step.mode===mode))",'generated lesson contains all three exercise forms')
 command('Page.reload');settle()
 check("data.session.kind==='guided' && data.session.index===0",'smart lesson resumes after reload')
 js("(async()=>{while(smartCurrent().mode==='intro')await smartNext();return true;})()");settle()
 check("smartCurrent().mode==='match'",'lesson reaches matching after introductions')
 command('Emulation.setDeviceMetricsOverride',{'width':320,'height':844,'deviceScaleFactor':1,'mobile':True})
 check("document.documentElement.scrollWidth<=innerWidth",'matching exercise fits 320px')
 command('Emulation.setDeviceMetricsOverride',{'width':390,'height':844,'deviceScaleFactor':1,'mobile':True})
 js("(async()=>{while(data.session?.kind==='guided'){const step=smartCurrent();if(step.mode==='intro'){await smartNext();continue;}if(step.mode==='match'){for(const id of [...step.ids])if(!step.matched.includes(id)){await smartMatch('left',id);await smartMatch('right',id);}if(data.session?.kind==='guided')await smartNext();continue;}const item=byId.get(step.ids[0]);await smartGrade(true,step.mode==='quiz'?step.options.indexOf(item[step.to]):null);if(data.session?.kind==='guided')await smartNext();}return true;})()");settle()
 check("!data.session && Object.keys(data.records).some(k=>k.endsWith('|lesson'))",'smart lesson completes and saves shared lifecycle progress')
 js("tab='study';render()");settle()
 png=command('Page.captureScreenshot',{'format':'png'})['data'];Path('/tmp/chinese-study.png').write_bytes(base64.b64decode(png))
 js("start()");settle();js("document.querySelector('#reveal').click()");settle();js("grade(true)");settle()
 check("data.session.total===1 && data.session.answered && record(current().id).correct===1",'flashcard grading saves one answer')
 js('grade(true)');check('data.session.total===1','repeated tap cannot double count')
 command('Page.reload');settle()
 check('data.session.total===1 && data.session.answered','reload resumes the graded card')
 js('next()');settle();check('!data.session.answered','next card hides answer')
 js('end()');settle();js("data.settings={type:'sentence',mode:'quiz',from:'en',to:'zh',pool:'all'};render();start()");settle()
 check('document.documentElement.scrollWidth<=innerWidth','sentence quiz fits 390px')
 js("grade(true,data.session.options.indexOf(current().zh))");settle()
 check("data.session.total===1 && data.session.correct===1",'quiz grading saves result')
 js("tab='library';render()");check("document.querySelectorAll('.entry').length>0",'library lists content')
 js("search='我爱你';renderEntries()");check("document.querySelectorAll('.entry').length===1",'library search filters Chinese')
 js("tab='progress';render()");check("document.body.textContent.includes('Offline files are ready')",'progress displays offline state')
 # Exercise restore UI with an actual File object and confirmed replacement.
 js("window.backup=JSON.stringify({...data,session:null});window.confirm=()=>true;window.restoreInput=document.querySelector('#restore');")
 js("restore({target:{files:[new File(['{}'],'bad.json')],value:''}})")
 check("document.querySelector('#backup-status').textContent.includes('not a valid')",'invalid backup rejected')
 js("restore({target:{files:[new File([window.backup],'backup.json')],value:''}})")
 check("document.querySelector('#backup-status').textContent.includes('successfully') && !data.session",'valid backup restored')
 for width in [320,375,430,844]:
  command('Emulation.setDeviceMetricsOverride',{'width':width,'height':844 if width<800 else 390,'deviceScaleFactor':1,'mobile':True})
  for view in ['study','library','progress']:
   js(f"tab='{view}';search='';render()")
   check('document.documentElement.scrollWidth<=innerWidth',f'{view} fits {width}px')
 command('Network.enable');command('Network.emulateNetworkConditions',{'offline':True,'latency':0,'downloadThroughput':0,'uploadThroughput':0})
 command('Page.reload');settle()
 check("document.querySelector('#start')!==null && storageOK",'app reloads offline with saved progress')
 js('start()');settle();js("grade(true, data.session.options.indexOf(current()[data.session.settings.to]))");settle()
 check('data.session.total===1','offline answer recorded')
 command('Page.reload');settle();check('data.session.total===1','offline answer survives reload')
 print('BROWSER CHECKS COMPLETE',flush=True)
finally:
 browser.terminate();server.shutdown()
