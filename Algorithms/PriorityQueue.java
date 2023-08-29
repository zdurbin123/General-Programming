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
