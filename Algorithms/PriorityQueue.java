/*Problem: 
Suppose you work for a major airline and are given the job of writing the algorithm for processing upgrades into first class on various flights. Any frequent flyer can request an upgrade for his or her up-coming flight using this online system. Frequent flyers have different priorities, which are determined first by frequent flyer status (which can be, in order, silver, gold, platinum, and super) and then, if there are ties, by length of time in the waiting list. In addition, at any time prior to the flight, a frequent flyer can cancel his or her upgrade request (for instance, if he or she wants to take a different flight), using a confirmation code they got when he or she made his or her upgrade request. When it is time to determine upgrades for a flight that is about to depart, the gate agents inform the system of the number, 
, of seats available in first class, and it needs to match those seats with the highest-priority passengers on the waiting list. Describe a system that can process upgrade requests and cancellations in O(logn)
 time and can determine the highest-priority flyers on the waiting list in O(klogn) time, where k is the number of frequent flyers on the waiting list. */



/*The solution is implemented using java with a class UpgradeRequestsNUA, which has a constructor for objects of type UpgradeRequestsNUA, which represent the upgrade requests for first class for the flight. The objects contain:
- a flyer ID which is incremented each time a request is created
-a frequent flyer status string which is either Gold, Silver, Platinum or Super and is inputted by the user who is creating the request 
-a corresponding frequent flyer status number which is used as the key value to sort the priority queue and is assigned depending on the status that is entered by the user (Silver is status of 1, Gold is status of 2, Platinum is status of 3, Super is status of 4) 
-a confirmation number which is also incremented each time a request is created and used by a locator array as an index where the location of the request in the priority queue is stored in locator[confirmationNum]
-the time that the request was created
The priority queue that is used to store the requests is a max heap, where the highest priority flyer is determined by the status (Super is highest), and then if there are ties when sorting the heap the time of the request is used as an auxiliary comparator, where the lowest time value has the higher priority. 
The heap is represented by an array called Requests of length 50, where the amount of requests in the heap is the integer variable size + 1. The function shiftUp(int i) takes as a parameter the index i of a request in the heap. This index is then used to shift up the request until it does not have a higher priority then its “parent”. It does this “shifting up” using a swap function which swaps the request with its parent. This function is called either when a new request is added to the heap (insert function), or when a request is cancelled using its confirmation number (requestCancel function). The function recursively calls itself until it does not need to perform a swap.
Similarly, the function shiftDown(int i) takes as parameter the index i of a request in the heap. This index is then used to shift down the request until it does not have a lower priority than its “child”. The caveat with this function is that it needs an additional priority compare if the request being shifted down (which would be the last element in the heap that was moved to the root) has the same priority as one of its children. Then the time that the request was made is used and if the time of the request being shifted down is lower (indicating an earlier request) than the child who has the same priority, it will stay put. The function recursively calls itself until it does not need to perform a swap.
The swap function is how the two functions explained above perform the shifting. It is a relatively straightforward swapping of requests within the Requests array, however there is an additional swap that is done with the locators of the two elements being swapped. 
The insert function uses the standard heap insert algorithm as described in the book, pseudocode is below:
Input: Request object to be added to priority queue
*/

import java.io.*;
import java.util.Scanner;

public class UpgradeRequestsNUA {
	
	private String freqFlyStatus; //determines key value
	private int freqFlyStatusNum; // key
	private long requestTime; //secondary key
	private int flyerID;
	private int confirmationNum;
	
	static UpgradeRequestsNUA []Requests = new UpgradeRequestsNUA[50];
	static int []locator = new int[50];
	static int size = -1;
	
	//requests constructor
	public UpgradeRequestsNUA(int flyerID, String freqFlyStatus, int confirmationNum, long requestTime) {
		
		this.flyerID = flyerID;
		this.freqFlyStatus = freqFlyStatus;
		this.confirmationNum = confirmationNum;
		this.requestTime = requestTime;
		
		
		if (this.freqFlyStatus.equals("Silver"))
			 freqFlyStatusNum = 1;
		else if (this.freqFlyStatus.equals("Gold"))
			 freqFlyStatusNum = 2;
		else if (this.freqFlyStatus.equals("Platinum"))
			 freqFlyStatusNum = 3;
		else if (this.freqFlyStatus.equals("Super"))
			 freqFlyStatusNum = 4;
		
	}
	
	static int getStatusNum(UpgradeRequestsNUA order) {
		return order.freqFlyStatusNum;
	}
	
	
	// return the index of the
	// parent of a given request
	static int parent(int i)
	{
	  return (i - 1) / 2;
	}
	
	static int leftChild(int i)
	{
	  return ((2 * i) + 1);
	}
	 
	// return the index of the
	// child of a given request
	static int rightChild(int i)
	{
	  return ((2 * i) + 2);
	}
	
	// shift up the
	// request in order to maintain
	// the heap property after an insert
	static void shiftUp(int i)
	{
	  while (i > 0 &&
			  getStatusNum(Requests[parent(i)]) < getStatusNum(Requests[i]))
	  {
		  
	    swap(parent(i), i);
	 
	    i = parent(i);
	  }
	}
	 
	// shift down the parent if there is a removal in
	// order to maintain the heap property
	static void shiftDown(int i)
	{
	  int maxIndex = i;
	 
	  int l = leftChild(i);
	 
	  if (l <= size) {
		  if (getStatusNum(Requests[l]) == getStatusNum(Requests[maxIndex]))
		  {
			  if (Requests[l].requestTime < Requests[maxIndex].requestTime)
			  	{
				  	maxIndex = l;
			  	}
		  }
		  else if (getStatusNum(Requests[l]) > getStatusNum(Requests[maxIndex]))
		  {
			  maxIndex = l;
		  }
	  }
	 
	  int r = rightChild(i);
	 
	  if (r <= size) {
		  if (getStatusNum(Requests[r]) == getStatusNum(Requests[maxIndex]))
		  {
			  if (Requests[r].requestTime < Requests[maxIndex].requestTime)
			  	{
				  	maxIndex = r;
			  	}
		  }
		  else if (getStatusNum(Requests[r]) > getStatusNum(Requests[maxIndex]))
		  {
			  maxIndex = r;
		  }
	  }
	 
	  if (i != maxIndex)
	  {
	    swap(i, maxIndex);
	    shiftDown(maxIndex);
	  }
	}
	
	static void insert(UpgradeRequestsNUA request)
	{
		
	//	increment array counter, add new request to bottom of heap,
	//  and store index of request in the locator array using confirmation
	//  number as the index
	  size = size + 1;
	  Requests[size] = request;
	  locator[request.confirmationNum] = size;
	 
	  // Shift Up to maintain
	  // heap property
	  shiftUp(size);
	}
	
	// extract highest priority request
	static UpgradeRequestsNUA extractMax()
	{
	  UpgradeRequestsNUA result = Requests[0];
	 
	  // Replace the request at the root with
	  // the last request and ensure its locator
	  // is updated accordingly
	  Requests[0] = Requests[size];
	  locator[Requests[0].confirmationNum] = 0; 
	  size = size - 1;
	 
	  // Shift down the replaced
	  // request to maintain the
	  // heap property
	  shiftDown(0);
	  return result;
	}
	
	static void swap(int i, int j)
	{
	  
	  //change locator of requests[i] to j, its new location
	  UpgradeRequestsNUA temp = Requests[i];
	  locator[Requests[i].confirmationNum] = j; 
	  
	  Requests[i] = Requests[j];
	   
	  //change locator of requests[j] to i, its new location
	  locator[Requests[j].confirmationNum] = i;
	  Requests[j] = temp;
	  
	  
	}
	
	static void processUpgrades(int numUpgrades) {
		
		UpgradeRequestsNUA firstClass;
		
		for (int i = 1; i <=numUpgrades; i++) {
			
			if (size < 0) {
				System.out.print("\nThere are no more upgrade requests to be processed\n");
				break;
			}
			else {
				firstClass = extractMax();
				System.out.print("Flyer ID " + firstClass.flyerID + " (" + firstClass.freqFlyStatus + ") was upgraded to first class.\n");
			}
		}
	}
	
	static void requestCancel(int confirmationNumber) {
		
		// access request for flyer using their confirmation number and
		// change priority to 5 so it will be shifted to the highest
		// priority position for the extractMax() function
		Requests[locator[confirmationNumber]].freqFlyStatusNum = 5; 
		
		shiftUp(locator[confirmationNumber]);
		
		extractMax();
	}
	
	public static void main(String[] args)
	{
		Scanner scan = new Scanner(System.in);
		
		char addRequest, removeRequest, end;
		String status;
		int id = 0;
		int confirmationNumber = 0;
		
		while(true) {
			
			
			while(true) {
				System.out.print("Request an upgrade? (y or n)\n");
				
				String str = scan.next();
				char ch[] = str.toCharArray();
			
				addRequest = ch[0];
			
				if (addRequest == 'n')
						break;
				else
				{
					System.out.print("\nEnter your frequent flyer status:\n");
					
					status = scan.next();
					
					//create new request using user input 
					UpgradeRequestsNUA newRequest = new UpgradeRequestsNUA(id, status, confirmationNumber, System.currentTimeMillis());
					
					id++;
					
					System.out.print("\nYour confirmation number is " + confirmationNumber + "\n");
					confirmationNumber++; 
					
					//add request to queue
					insert(newRequest);
				}
			}
			
			while(true) {
				System.out.print("\nCancellation requests? (y or n)\n");
				
				String str1 = scan.next();
				char ch1[] = str1.toCharArray();
			
				removeRequest = ch1[0];
				
				if (removeRequest == 'n')
					break;
				else
				{
					System.out.print("\nEnter your confirmation number to cancel your request:\n");
					confirmationNumber = scan.nextInt();
					
					//remove request from queue using confirmation number
					requestCancel(confirmationNumber);
				}
			}
			
			//display the queue of requests
			
			int i = 0;
			
			
			while (i <= size) {
				
				System.out.println(Requests[i].flyerID + " - " + Requests[i].freqFlyStatus);
		    	i++;
			}
			
			System.out.print("\nContinue processing requests/cancellations? (y or n)\n");
			
			String str2 = scan.next();
			char ch2[] = str2.toCharArray();
		
			end = ch2[0];
			
			if (end == 'n')
				break;
			else
				continue;
		}
		
		System.out.print("It is time to depart. How many first class seats are available?\n");
		
		int k = scan.nextInt();
		
		processUpgrades(k);
		
	}
	
}
