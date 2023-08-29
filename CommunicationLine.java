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
