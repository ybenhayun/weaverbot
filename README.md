# Weaverbot
This is a bot that will find all of the shortest word ladders between two four letter words. As in the, the shortest path of words where each word is only one letter different from the one prevoious. 

ex: A word ladder connecting STOP to THIS could be STOP --> SHOP --> SHIP --> SHIN --> THIN --> THIS.
Designed for the game [Weaver](https://wordwormdormdork.com/).

Enter in any two four letter words, and it will draw all paths on the screen as a trie. 

# Algorithm 
The bot starts by looking for all possible neighbor words (words that could follow the starting word by only changing one letter). If the ending word is in that list of neighbors, then the bot has found the paths. Otherwise, it will look for all possible neighbors to all of those neighbor words, until the ending word is in the set. While doing this I use a hashtable to keep track of which words preceded the current nodes. It will also keep track if multiple words precede a common word, ie: both BACK and HACK can be parents to RACK. The hashtable would save that data like this:

RACK: BACK, HACK, LACK..      
RANK: RACK, BANK, SANK, RANT...       
RANT: PANT, CANT, RUNT...       

This way when the bot traverses upon the ending word, it will be able to create all possible paths by traverse up the trie, starting at the ending word, and iterating through parent node until it reaches the starting word. 

The tree is drawn using javascript canvas.

# Site 
You can play around with the bot yourself [here](https://ybenhayun.github.io/weaverbot/)