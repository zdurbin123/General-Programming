/*Problem:
Suppose you are given a diagram of a telephone network, which is a graph 
 whose vertices represent switching centers, and whose edges represent communication lines between two centers. The edges are marked by their bandwidth, that is, the maximum speed, in bits per second, that information can be transmitted along that communication line. The bandwidth of a path in 
 is the bandwidth of its lowest-bandwidth edge. Give an algorithm that, given a diagram and two switching centers 
 and 
, will output the maximum bandwidth of a path between 
 and 
. What is the running time of your algorithm?
*/



/*Solution:
The algorithm for the maximum spanning tree in G given a graph with vertices that represent switching centers and weighted edges that represent the bandwidth of the communication line between them is based on Dijkstra’s algorithm, which finds the “shortest” path to any vertex in a graph from a given vertex in G. There would be a label for each switching center which represents the bandwidth on a path to it from the given starting switching center, which would be initialized to 0 for all switching centers other than the starting one. Then for each vertex v beginning with the starting one, the algorithm would find all vertices i adjacent to it, and for each, it would calculate the minimum of the label of v and the bandwidth to it, and compare that result with the current label of i, updating the label of i if it is greater.
The solution that I programmed using Java uses an adjacency matrix to store the edges, or communication lines, of the graph. The edges are objects of type CommunicationLine, which has three attributes associated with it, which are the two vertices (or switching centers, represented by sc1 and sc2) and the bandwidth of the edge (represented by bandwidth). Additionally, for the algorithm which is programmed in the maxBandwidth method, there is a HashMap called ‘vertexLabels’ used to store the label of each switching center, and a HashMap called ‘vertexVisited’ used to store key-value pair, where the key is a switching center which has already been ‘visited’ and the value is just its label after being visited and updated. The method takes 4 parameters, which are the start and end vertices, as well as the number of switching centers in the network, and a hashMap which simply maps the switching center name to the index that it corresponds to within the adjacency matrix. The method then implements the algorithm described above.
 When entering input, the user must label the switching centers with letters starting with A and moving sequentially in alphabetically order, with a limit of 10 switching centers. Then the user can tell the program which switching centers have a communication line between them, and finally indicate what the start and end switching centers are supposed to be. 
*/



import java.util.HashMap;
import java.util.Scanner;
import java.io.*;

public class CommunicationLine {

	private char sc1, sc2;
	private int bandwidth;
	
	static CommunicationLine [][] network = new CommunicationLine[10][10]; //adjacency matrix
	static char [] vertices = new char[10];
	
	public CommunicationLine(char sc1, char sc2, int bandwidth) {
		
		this.sc1 = sc1;
		this.sc2 = sc2;
		this.bandwidth = bandwidth;
	}
	
	static int maxBandwidth(char start, char end, int numVertices, HashMap<Character, Integer> vertexIndices) {
		
		HashMap<Character, Integer> vertexLabels = new HashMap<Character, Integer>();
		HashMap<Character, Integer> vertexVisited = new HashMap<Character, Integer>();
		
		int maxVal = 0;
		char maxVertex = start;
		char currVertex = start;
		
		for (int i = 0; i < numVertices; i++) {
			if (vertices[i] == start) {
				vertexLabels.put(vertices[i], 1000000);
				vertexVisited.put(vertices[i], null);
			}
			else {
				vertexLabels.put(vertices[i], 0);
				vertexVisited.put(vertices[i], null);
			}
		}
				
		int currIndex = vertexIndices.get(start);
		currVertex = start;
			
		for (int i = 0; i < numVertices; i++) {
			for (int j = 0; j < numVertices; j++) {
				if (network[currIndex][j] != null && vertexVisited.get(network[currIndex][j].sc2) == null && currIndex != j) {
						// update d[v] to min{d[u],w(u,v)}
						if (Math.min(network[currIndex][j].bandwidth, vertexLabels.get(vertices[currIndex])) > vertexLabels.get(vertices[j])) {
							vertexLabels.replace(vertices[j], Math.min(network[currIndex][j].bandwidth, vertexLabels.get((vertices[currIndex]))));
							}
				}
		}
			
			vertexVisited.replace(currVertex, vertexLabels.get(currVertex)); // add vertex which was just used to find all other adjacent to it to a new list
			
			for (int n = 0; n < numVertices; n++) {
				if ((vertexVisited.get(vertices[n]) == null) && (vertexLabels.get(vertices[n]) > maxVal)) {
						maxVal = vertexLabels.get(vertices[n]); //update max value for next iteration
						maxVertex = vertices[n];
				}
			}
			
			currIndex = vertexIndices.get(maxVertex);
			currVertex = maxVertex;
			maxVal = 0;
	}

		return vertexLabels.get(end);
}
	
	public static void main(String[] args) {
		
		Scanner scan = new Scanner(System.in);
		
		System.out.print("Please enter the switching centers labeled by letter (max 10, in order, A through J):\n");
		
		char done = 'Y';
		char newVertex, edgeExists, startCenter, endCenter;
		String str;
		int vertCount = 0, nextBandwidth;
		
		while (done == 'Y') {			
			
			System.out.print("\nInput switching center:\n");
			
			str = scan.next();
			char ch1[] = str.toCharArray();
			newVertex = ch1[0];
			
			vertices[vertCount] = newVertex;
			vertCount++;
			 
			System.out.print("\nContinue? (Y or N)\n");
			
			str = scan.next();
			char ch2[] = str.toCharArray();	
			done = ch2[0];
			
		}
		
		for (int i = 0; i < vertCount; i++) {
			for (int j = 0; j < vertCount; j++) {
				if ((network[j][i] == null) && (i != j) && (i < j)) { // skip adding an edge if it already exists since graph is undircected
					
					System.out.print("\nCommunication line between " + vertices[i] + " and " + vertices[j] + "? (Y or N)\n");
				
					str = scan.next();
					char ch3[] = str.toCharArray();
					edgeExists = ch3[0];
				
					//add new edge to adjacency matrix
					if (edgeExists == 'Y') {
						System.out.print("\nEnter bandwidth:\n");
						nextBandwidth = scan.nextInt();
					
						CommunicationLine newCom = new CommunicationLine(vertices[i], vertices[j], nextBandwidth);
						CommunicationLine newComReverse = new CommunicationLine(vertices[j], vertices[i], nextBandwidth);
					
						network[i][j] = newCom;
						network[j][i] = newComReverse;
					}
				}
			}
		}
		System.out.print("\nEnter start and end vertex \n");
		
		str = scan.next();
		char ch4[] = str.toCharArray();	
		startCenter = ch4[0];
		
		str = scan.next();
		char ch5[] = str.toCharArray();	
		endCenter = ch5[0];
		
		HashMap<Character, Integer> vertexIndex = new HashMap <Character, Integer>();
		
		for (int i = 0; i < vertCount; i++)
			vertexIndex.put(vertices[i], i);

		int maxPathBandwidth = maxBandwidth(startCenter, endCenter, vertCount, vertexIndex);
		
		//if algorithm returns 0 this means the label for the designated end was not updated meaning there is no path to the switching center
		if (maxPathBandwidth == 0)
			System.out.print("\nNo path exists from " + startCenter + " to " + endCenter);
		else 
			System.out.print("\nMaximum bandwidth from " + startCenter + " to " + endCenter + " is " + maxPathBandwidth);
		
	}
}
