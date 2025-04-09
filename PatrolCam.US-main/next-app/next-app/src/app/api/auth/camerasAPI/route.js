// /app/api/cameras/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/config/dbConn';
import Camera from '@/lib/model/Camera';
// Check the relative path based on your folder structure.
import User from '@/lib/model/User'; // Adjust the import path as needed

export async function GET() {
  try {
    // Get the user session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Connect to database
    await connectDB();

    //get userid from session
    const userId = session.user.id;


    //check if user is admin
    const isAdmin = session.user.role.includes('Admin');
   
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }
    
    // Find the user's organization
    const foundUser = await User.findById(userId);

    if (!foundUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the organization ID from the user
    const organizationId = foundUser.organization;
    if (!organizationId) {
      return NextResponse.json({ error: 'Organization of user not found' }, { status: 404 });
    }

    
    // Get all cameras for this organization
    const cameras = await Camera.find({ owner: organizationId });

    const cameraDetails = cameras.map(camera => {
      return {
        id: camera._id,
        camera_Name: camera.camera_Name,
        model: camera.model,
        owner: camera.owner,
        location: camera.location,
        status: camera.status,
      };
    });

    
    return NextResponse.json({ cameras: cameraDetails });
  } catch (error) {
    console.error('Error fetching cameras:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


// Endpoint to add a new camera (for future use)
/*export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const user = await User.findById(session.user.id);
    
    // Check if user has admin role
    const isAdmin = user.roles.includes('Admin');
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }
    
    const data = await request.json();
    
    await connectDB();
    
    // Add organization ID to the camera data
    // Assuming the camera data includes fields like camera_Name, model, location, status, etc.
    data.organizationId = user.organization;
    
    const newCamera = await Camera.create(data);
    
    return NextResponse.json({ 
      message: 'Camera added successfully', 
      camera: newCamera 
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding camera:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}


// Endpoint to update a camera (for future use)
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const userId = session.user.id; // Gets the user from the session specified by the ID
    
    // Check if user has admin role
    const isAdmin = session.user.role;
    if (isAdmin != 'Admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }
    
    const data = await request.json(); // Assuming data contains the camera ID and updated details
    
    await connectDB();
    
    // Update the camera details
    const updatedCamera = await Camera.findByIdAndUpdate(
      data._id,
      data, 
      { new: true }
    );

    console.log('Updated Camera:', updatedCamera);
    
    if (!updatedCamera) {
      return NextResponse.json({ error: `Cant find id ${data._id || 'null'}` }, { status: 404 });

    }
    
    return NextResponse.json({ 
      message: 'Camera updated successfully', 
      camera: updatedCamera 
    });
  } catch (error) {
    console.error('Error updating camera:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
*/

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Authentication check
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Authorization check
    if (session.user.role !== 'Admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await connectDB();
    
    //Get organization from user
    const user = await User.findById(session.user.id);
    if (!user?.organization) {
      return NextResponse.json({ error: 'User organization not found' }, { status: 400 });
    }

    const data = await request.json();

    console.log('This is the Request payload:', data); // Log the request payload for debugging
 

    

    const existingCamera = await Camera.findOne({
      owner: data.owner,
    });

    console.log('Camera Verification Result:', existingCamera ? 'Found' : 'Not found');

    if (!existingCamera) {
      return NextResponse.json(
        { error: 'Camera not found in your organization' },
        { status: 404 }
      );
    }
    const updatedCamera = await Camera.findOneAndUpdate(
      { owner: data.owner },
      {
        camera_Name: data.camera_Name,
        model: data.model,
        status: data.status,
        location: data.location
      },
      { new: true } // Return the updated document
    );

    if (!updatedCamera) {
      return NextResponse.json(
        { error: `Camera not found or not in organization ${user.organization}` }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Camera updated successfully', 
      camera: updatedCamera 
    });

  } catch (error) {
    console.error('Error updating camera:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}