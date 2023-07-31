# 🎲Dice Cup🎲
![DICE_CUP_Logo_Weiss_PNG](https://github.com/danielmeisler/DiceCup/assets/64088909/deea0ee6-47fa-49ec-9a5c-c6660d4b7b6a)

## ⚀ Description
DICE CUP is a dice game from the authors Christoph Cantzler and Torsten Marold and the producer "Drei Hasen in der Abendsonne". It is intended for 2 to 6 players and a game takes about 15 to 20 minutes. The goal of this game is to get the most points by trying to remember the 12 dice as well as possible in 3 seconds and then choosing the best possible category. <br>
The gameplay consists of the following phases. Each player gets a score sheet on which the points will be written down. After that, a player rolls the cup and shows the dice for 3 seconds. After the dice are covered again, each player chooses a category that he wants to score. Now the dice are shown again and each player calculates and writes down his chosen category. This category is now locked for the rest of the game. The next player rolls the dice and this process is repeated for 12 rounds until all categories are used up.
This analogue game has now been implemented as a digital version.
<br> <br>
![image](https://github.com/danielmeisler/DiceCup/assets/64088909/9eff3e35-0873-4585-b648-67831206e429)

## ⚁ Digital Version
The digital version plays almost exactly the same as the original game. A single player and multiplayer variant is available. In single player you can add bots of different difficulty levels. You choose your mode and set your lobby. Then the game is started and proceeds like its analogue version, only automated. The player now only has to remember the dice and select a category. After each round, the intermediate result is displayed, which you can skip. This continues for 12 rounds until all categories are used up and at the end the rankings are shown.

## ⚂ How to install
To install the PWA (Progressive Web App) on your mobile phone or desktop pc you need to open the application in a browser that supports pwa like Google Chrome. While staying in the open tab you go into the three dot menu and click on "Install Dice Cup...". The game will be installed with a shortcut on your homescreen or desktop.

## ⚃ How to use
To continue development you need to clone or download this reposotiry and open it in a code editor like Visual Studio Code. Make sure to have Node.js installed and "npm install" all from the package.json. If you want to model or change something about the arena etc. you need to open the FUDGE Editor program named "FUDGE.bat". If you want to rewrite or extend the server code you need to change FUDGE Net directly.

If you want to start the local server you need to change the number in the Client (Game/Script/Source/utils/Client.ts) at Line 84. If you want to user another server just change or add another url.

0 = ws://localhost:9001
1 = wss://dice-cup.onrender.com
...

The render server is a free but limited server. It shuts itself down, if no new client gets connected within 15min. If a new client connects than the server needs few minutes to start automatically and you need to restart the page so the client is connected.

## ⚄ Copyright
All assets and files are selfmade or copyright free. 

## ⚅ Credits
The project was developed as part of a bachelor thesis by Daniel Meisler. The game itself was made by the authors Christoph Cantzler and Torsten Marold and the producer "Drei Hasen in der Abendsonne".

