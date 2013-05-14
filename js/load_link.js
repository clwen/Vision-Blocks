var icon={  'play':'play', 
        'playForever':'play-forever', 

        'remoteImage':'load-image', 
        'loadImage':'load-image', 
        'loadVideo':'load-video', 
        'loadWebcam':'webcam',      
      'loadFoodcam': 'webcam',
      'loadTrafficcam':'webcam',
      'loadParkingcam':'webcam',
      'loadLaundrocam':'webcam',
      'loadStorecamA':'webcam',
      'loadStorecamB':'webcam',
      'loadBirdcam':'webcam',

      'invert':'fake',
      'pixelization':'fake',      
      'grayscale':'fake',
      'binarize':'fake',
      'blur':'distortion',
      'swirl':'distortion',
      'mirror':'distortion',
      'spherize':'distortion',

      'colorDetection':'fake',
      'skinDetection':'detect-face',
      'faceDetection': 'detect-face',
      'intrusionDetection':'detect-face',
      'opticalFlow':'detect-face',
      'opticalIntrusion':'detect-face',

      'drawRegions':'draw-rect',
      'writeText':'draw-rect',


      'browserAlert':'draw-rect',
      'osAlert' :'draw-rect',
    }
var title={ 'play': 'Play', 
      'playForever':'Play Forever', 

      'remoteImage':'Remote Image', 
      'loadImage': 'Upload Image', 
      'loadVideo': 'Upload Video',
      'loadWebcam':'Webcam',      
      'loadFoodcam':'Foodcam',
      'loadTrafficcam':'Trafficcam',
      'loadParkingcam':'Parkingcam',
      'loadLaundrocam':'Laundrocam',
      'loadPortcam':'Portcam',
      'loadStorecamA':'StorecamA',
      'loadStorecamB':'StorecamB',
      'loadBirdcam':'Birdcam',

      'invert':'Invert Color',
      'pixelization': 'Pixelization',
      'grayscale':'Grayscale',
      'binarize':'Binarize',
      'blur':'Blur',
      'swirl':'Twirl',
      'mirror':'Mirror',
      'spherize':'Spherize',

      'colorDetection':'Сolor Detection',
      'skinDetection':'Skin Detection',
      'faceDetection': 'Face Detection',
      'intrusionDetection': 'Motion Detection',
      'opticalFlow':'Optical Flow',
      'opticalIntrusion': 'Optical Intrusion',

      'drawRegions':'Draw Rect',
      'writeText':'Text',

      'browserAlert':'Browser Alert',
      'osAlert':'Desktop Alert',
    }

var blockType={ 'play': 'source', 
      'playForever':'source', 

      'remoteImage':'source', 
      'loadImage': 'source', 
      'loadVideo': 'source',
      'loadWebcam':'source',      
      'loadFoodcam':'source',
      'loadTrafficcam':'source',
      'loadParkingcam':'source',
      'loadLaundrocam':'source',
      'loadPortcam':'source',
      'loadStorecamA':'source',
      'loadStorecamB':'source',
      'loadBirdcam':'source',

      'invert':'filters',
      'pixelization': 'filters',
      'grayscale':'filters',
      'binarize':'filters',
      'blur':'filters',
      'swirl':'filters',
      'mirror':'filters',
      'spherize':'filters',

      'colorDetection':'vison',
      'skinDetection':'vison',
      'faceDetection': 'vison',
      'intrusionDetection': 'vison',
      'opticalFlow':'vison',
      'opticalIntrusion': 'vision',

      'drawRegions':'draw',
      'writeText':'draw',

      'browserAlert':'alert',
      'osAlert':'alert',
    }



var makeBlockHtml = function(name, leftOff, level){
  var text=''
  var text1=''  
  if ((name=='play') || (name=='playForever')){
    var width=182 
    text+='<div id="block-'+name+'" class="build-block block-container-start build-block-1" data-block-name="'+name
    text+='" style="">'+ '<div class="build-block-title-wrapper build-block-recalc-width" style="width:'+width+'px;">'
    text+='<div class="build-block-title"><div class="icon1-build-block icon1-'+icon[name]+'"></div><span class="play-title">'+title[name]+'</span><div class="icon-remove-block"></div>'
    text+='</div></div><div class="build-block-top"></div><div class="content" style="height: '+150+'px;"><div class="build-block-1-leftbar" style="height: '+'auto'+'px;"></div>'
      text1='</div><div class="build-block-bottom build-block-recalc-width" style="width: 182px;"></div><div class="build-block-1-bottom-fill build-block-recalc-width" style="width: 182px;"></div></div>'
  } else if (name=='ifBlock'){
    var left
    if (leftOff>0) left=12
    var top=-20-8*level
    var width=182-left
    text='<div id="block-ifBlock" class="build-block block-container-logic build-block-if build-block-extra-popover build-block-1 build-block-3" data-block-name="ifBlock'
    text+='" style="top:'+top+'px; left: '+left+'px;">'+ '<div class="build-block-2-top build-block-recalc-width" style="width:'+width+'px;"></div>'
    text+='<div class="build-block-title-wrapper build-block-recalc-width popover-enable" style="width: '+width+'px;" data-original-title="">'
    text+='<div class="build-block-title"><div class="icon1-build-block icon1-if"></div><span>'+'IF'+'</span><div class="icon-remove-block"></div>'
    text+='<div class="build-block-desc"><span>intrusion ==true</span></div></div></div><div class="build-block-top"></div>'
    text+='<div class="content" style="height:'+20+'px;"> <div class="build-block-1-leftbar-container"><div class="build-block-1-leftbar" style="height:'+41+'px;"></div></div>'
    text1='</div><div class="build-block-bottom build-block-recalc-width" style="width: '+width+'px;"></div>'
      text1+='<div class="build-block-1-bottom-fill build-block-recalc-width" style="width: '+width+'px;"></div>'
      text1+='<div class="build-block-2-bottom build-block-recalc-width" style="width:'+width+'px;"></div></div>'
  }else{
    var left
    if (leftOff>0) left=12
    var top=-20-8*level
    var width=182-left
    text='<div id="block-'+name+'" class="build-block build-block-'+name+' block-container-'+blockType[name]+' build-block-2" data-block-name="'+name
    text+='" style="top:'+top+'px; left:'+left+'px;">'+ '<div class="build-block-2-top build-block-recalc-width" style="width:'+width+'px;"></div>'
    text+='<div class="build-block-2-title-wrapper build-block-recalc-width popover-enable" style="width: '+width+'px;" data-original-title="">'
    text+='<div class="build-block-2-title"><div class="icon1-build-block icon1-'+icon[name]+'"></div><span>'+title[name]+'</span><div class="icon-remove-block"></div>'
    text1='</div></div><div class="build-block-2-bottom build-block-recalc-width" style="width: '+width+'px;"></div></div>'
  }

  return [text,text1]
}


$('#save-button').click(function(){
  var getChildren=function(Block,start){
    console.log(Block)
    var children=$(Block).children('.content').children('.build-block') 
    console.log(children)
    blocksToEncode[start]={}
    
    blocksToEncode[start].name=$(Block).data('block-name')
    blocksToEncode[start].settings=$(Block).data('block-options')
    blocksToEncode[start].end=start
    for (var i=1; i<=children.length;i++){
      blocksToEncode[start].end+=getChildren(children[i-1], start+i) //
    }
    return blocksToEncode[start].end-start+1
  }
  var blocksToEncode=[] 
  getChildren($('.build-area').children('.build-block')[0],0) 
  //console.clear()
  $('#link').val(window.location.href.split('?')[0]+'?'+jQuery.param({blocks: blocksToEncode})) 
  $('#link').show()
  $('#copy-button').show()
})
  
