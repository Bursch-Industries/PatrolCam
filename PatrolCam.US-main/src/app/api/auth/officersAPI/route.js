// // TODO: Get the organization of the user id
// // Get the users in the organization
// Check if the user is an Admin

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/config/dbConn';
import Organization from '@/lib/model/Organization';
import User from '@/lib/model/User';

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

        // Get the user ID from the session
        const userId = session.user.id;

        //Check if user is admin
        const isAdmin = session.user.role.includes('Admin'); //TOIDO: Check also if AccoundADMIN
        //const isAccountAdmin = session.user.role.includes('AccountAdmin'); //TOIDO: Check also if Admin

        if (!isAdmin) {
            return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
        }
        // if (!isAccountAdmin) {
        //     return NextResponse.json({ error: 'Unauthorized - AccountAdmin access required' }, { status: 403 });
        // }

        // Find the user's organization
        const foundUser = await User.findById(userId);
        if (!foundUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const organizationId = foundUser.organization;
        if (!organizationId) {
            return NextResponse.json({ error: 'Organization of user not found' }, { status: 404 });
        }

        // Get organization details
        const organization = await Organization.findById(organizationId);
        if (!organization) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        const organizationUserId = {
            users: organization.users,
        };

        // Get the users in the organization
        const users = await User.find(
            { _id: 
            { $in: organizationUserId.users } 
            },
            { firstname: 1, lastname: 1, roles: 1, status: 1 } // Select only the fields you need
        );
        if (!users) {
            return NextResponse.json({ error: 'No users found in the organization' }, { status: 404 });
        }


        return NextResponse.json({ officers: users });
    }
    catch (error) {
        console.error('Error fetching organization details:', error);
        return NextResponse.json({ error: 'Failed to fetch organization details' }, { status: 500 });
    }
}