# -*- coding: utf-8 -*-
"""
Created on Thu Oct 28 10:21:06 2021

@author: TrueBlueFeather
"""
import matplotlib.pyplot as plt 
import numpy as np
import math

is_animating = True
figure = plt.figure()
timer = figure.canvas.new_timer(interval=30)
ax = figure.add_subplot(1, 1, 1)

is_right_pressed = False
is_left_pressed = False
is_up_pressed = False
ballX=0.5
ballY=1.0
ballVY=0

stage = []
stage.append([1, 0, 0])
stage.append([4, 0, 1])

stage.append([9, 1, 0])
stage.append([11, 3, 0])
stage.append([12, 3, 0])
stage.append([14, 4, 0])
stage.append([17, 4, 0])

stage.append([21, 3, 0])
stage.append([24, 2, 0])
stage.append([26, 5, 2])
stage.append([27, 4, 2])
stage.append([27, 3, 2])

stage.append([32, 0, 0])
stage.append([33, 0, 0])
stage.append([33, 1, 0])
stage.append([34, 0, 0])
stage.append([34, 1, 0])
stage.append([34, 2, 0])
stage.append([35, 3, 3])
for i in range(10, 25):
    stage.append([i, 0, 1])
stageArray = np.array(stage)

sizes = [500, 500, 300, 500]
markers = ["s", "^", "d", "*"]
colors = ["#B97A57", "#666666", "#ffff00", "#ffff00"]

X=[]
Y=[]
def setStage():
    global X, Y
    X=[]
    Y=[]
    for i in range(4):
        X.append(stageArray[stageArray[:,2]==i][:,0]*0.1+0.05)
        Y.append(stageArray[stageArray[:,2]==i][:,1]*0.1+0.05)
setStage()

def getData(x, y):
    if(y < 0):
        return 0
    buf=stageArray[stageArray[:,0]==math.floor(x)]
    if(len(buf) == 0):
        return None
    buf=buf[buf[:,1]==math.floor(y)]
    if(len(buf) == 0):
        return None
    return buf[0,2]

def canGoThrough(a):
    return a!=0 and a!=1

def onTimer():
    global ballX, ballY, ballVY, is_right_pressed, is_left_pressed, is_up_pressed, X, Y
    if(is_animating):
        timer.start()
        ax.cla()
        ax.set_aspect("equal")
        ax.set_xlim([0, 1])
        ax.set_ylim([0, 1])
        ax.patch.set_facecolor("#ddeeff")
        for i in range(4):
            ax.scatter(X[i]+0.5-ballX*0.1, Y[i], s=sizes[i], marker=markers[i], c=colors[i])
        ax.scatter([0.5], [ballY*0.1], s=300, marker="o", c="blue")
        if(is_right_pressed and canGoThrough(getData(ballX+0.5, ballY+0.3))!=0 and canGoThrough(getData(ballX+0.5, ballY-0.3))!=0):
            ballX+=0.1
        if(is_left_pressed and canGoThrough(getData(ballX-0.5, ballY+0.3))!=0 and canGoThrough(getData(ballX-0.5, ballY-0.3))!=0):
            ballX-=0.1
        
        charactorBack=getData(ballX, ballY)
        if(charactorBack == 2):
            for i in range(len(stageArray)):
                if(stageArray[i,0] == math.floor(ballX) and stageArray[i,1] == math.floor(ballY)):
                    stageArray[i,2]=-1
                    setStage()
        if(charactorBack == 3):
            plt.title("Clear!!")
            plt.draw()
            return
        
        mainGround=getData(ballX, ballY-0.4)
        subGround=None
        if(ballX-math.floor(ballX)<=0.3):
            subGround=getData(ballX-0.3, ballY-0.4)
        if(ballX-math.floor(ballX)>=0.7):
            subGround=getData(ballX+0.3, ballY-0.4)
        
        if(mainGround==1 or (canGoThrough(mainGround) and subGround==1)):
            ballX=0.5
            ballY=0.5
            ballVY=0
        
        if(canGoThrough(mainGround) and canGoThrough(subGround) != 0):
            if(ballVY>-6):
                ballVY-=0.3
        else:
            if(is_up_pressed):
                ballVY=4
            else:
                ballVY=0
        for i in range(abs(math.floor(ballVY))):
            if(ballVY < 0):
                if(canGoThrough(getData(ballX-0.3, ballY-0.4)) and canGoThrough(getData(ballX+0.3, ballY-0.4))):
                    ballY-=0.1
            if(ballVY > 0):
                if(canGoThrough(getData(ballX-0.3, ballY+0.4)) and canGoThrough(getData(ballX+0.3, ballY+0.4))):
                    ballY+=0.1
                    
        plt.draw()
def onKeyPress(e):
    global is_right_pressed, is_left_pressed, is_up_pressed
    if(e.key=="right"):
        is_right_pressed = True
    if(e.key=="left"):
        is_left_pressed = True
    if(e.key=="up"):
        is_up_pressed = True
def onKeyRelease(e):
    global is_right_pressed, is_left_pressed, is_up_pressed
    if(e.key=="right"):
        is_right_pressed = False
    if(e.key=="left"):
        is_left_pressed = False
    if(e.key=="up"):
        is_up_pressed = False
def onClose(e):
    global is_animating
    is_animating = False

timer.single_shot = True
timer.add_callback(onTimer)
timer.start()

plt.connect("close_event", onClose)
plt.connect('key_press_event', onKeyPress)
plt.connect('key_release_event', onKeyRelease)
plt.show()