import { ItemView, View, WorkspaceLeaf, setIcon } from "obsidian";
import { clearInterval } from "timers";
//import audio from "./public/assets/bell.mp3";
// @ts-ignore
//const testAudio = require("../obsidian-sample-plugin/bell.mp3")  

import { alarmUrl } from './audio_urls';

export const VIEW_TYPE_EXAMPLE = "Timer";

export class Timer extends ItemView {
  private theTimer: HTMLInputElement
  private myTimerString: HTMLHeadingElement
  private myContainer: Element

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
    
    setIcon(this.contentEl, "alarm-clock")
    this.icon = "alarm-clock"
  }

  getViewType() {
    return VIEW_TYPE_EXAMPLE;
  }

  getDisplayText() {
    return "Timer";
  }

  private setContainer(theContainer: Element) {
    this.myContainer = theContainer;
  }

  createTimer(): void {
    console.log("createTimer")

  }

  private stopTimer() {
    console.log("stopTimer()")
  }

  private handleClick(theTimer: HTMLInputElement, theContainer:Element) {
    var currentDate = new Date()
    
    const re = '((?<minutes>[0-9]{2}):(?<seconds>[0-9]{2}))';
    
    
    const match = theTimer.value.match(re).groups
    if (match == null) {
      return console.log("Input Error")
    }
    console.log(theTimer.value);
    console.log(theTimer.value.match(re));
    console.log(theTimer.value.padStart(5, '00:00'))
    var alarmAudio = new Audio(alarmUrl);
    alarmAudio.loop = true;
    var isAlarm:boolean = true;

    // Cast string into Number
    const timer_minutes = Number(match.minutes);
    const timer_seconds = Number(match.seconds);

    console.log(timer_minutes, timer_seconds)

    // Calculate into remaining minutes 
    var total_seconds = timer_minutes*60 + timer_seconds
    //console.log(total_seconds);

    // Create initial timer display
    const theTimerString = theContainer.createEl("h5", {text: Math.floor(total_seconds/60).toString() + ":" + (total_seconds%60).toString().padStart(2, '0')})
    const stopButton = theContainer.createEl("button", {text: "stop", type: "button"})
    stopButton.addEventListener("click", ()=> {
      isAlarm = false;
      alarmAudio.pause();
      alarmAudio.remove();
      theTimerString.remove();
      stopButton.remove();
    })
    var minutes, seconds:number = 0;

    // Timer function using Nested Timeouts
    //total_seconds = 2;
    const timer = setTimeout(function run(clr) {
      total_seconds = total_seconds -  1;
      minutes = Math.floor(total_seconds/60);
      seconds = total_seconds%60;
      theTimerString.setText(minutes.toString() + ":" + seconds.toString());
      if(total_seconds == 0) {
        console.log("clear interval")
        clearInterval(clr);
        
        if(isAlarm) {
          alarmAudio.play();
        }
        
      } else {
        setTimeout(run, 1000);
        
      }
      
      
    }, 1000)
      


  }

  async onOpen() {
    
    
    this.myContainer = this.containerEl.children[1];
    this.setContainer(this.myContainer)
    this.myContainer.empty();
    console.log(this.myContainer)
    this.myTimerString = this.myContainer.createEl("h4", { text: "Timer" });

    // Time Input
    const currentDate = new Date();
    const currentDateString = "{0}:{1}".format(currentDate.getHours().toString().padStart(2, '0'), currentDate.getMinutes().toString().padStart(2, '0'))
    //this.theTimer = this.myContainer.createEl("input", { type: "time", value: currentDateString})
    //this.theTimer.step = "1";

    this.theTimer = this.myContainer.createEl("input")
    this.theTimer.pattern = '/(\d?\d):?(\d?\d)/'
    this.theTimer.placeholder = "MM:SS"
    

    const theButton = this.myContainer.createEl("button", { text: "ADD", type: "button"})
    theButton.addEventListener("click", this.handleClick.bind(null, this.theTimer, this.myContainer))
    
  }

  async onClose() {
    // Nothing to clean up.
  }
}