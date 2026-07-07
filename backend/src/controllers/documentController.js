const Document = require('../models/Document');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// ──────────────────────────────────────────────────────────
// SUPER ADMIN: GET ALL DOCUMENTS (cross-tenant)
// ──────────────────────────────────────────────────────────
exports.getAllDocuments = async (req, res) => {
    try {
        const { organizationId, docType, uploadedBy, search } = req.query;
        const query = {};

        if (organizationId) {
            query.organization = organizationId;
        }
        if (docType) {
            query.docType = docType;
        }
        if (uploadedBy) {
            query.uploadedBy = uploadedBy;
        }
        if (search) {
            query.documentName = { $regex: search, $options: 'i' };
        }

        const docs = await Document.find(query)
            .populate('organization', 'name')
            .populate('owner', 'name')
            .populate('uploadedBy', 'name email')
            .populate('updatedBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: docs.length, data: docs });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ──────────────────────────────────────────────────────────
// SUPER ADMIN: UPLOAD DOCUMENT
// ──────────────────────────────────────────────────────────
exports.createDocument = async (req, res) => {
    try {
        const { documentName, docType, organizationId, allowedRoles } = req.body;

        if (!documentName || !docType) {
            return res.status(400).json({
                success: false,
                message: 'documentName and docType are required'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'File is required'
            });
        }

        // Upload to Cloudinary
        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'documents', resource_type: 'raw' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });

        const cloudinaryResult = await uploadPromise;

        const doc = await Document.create({
            documentName,
            docType,
            url: cloudinaryResult.secure_url,
            cloudinaryPublicId: cloudinaryResult.public_id,
            organization: organizationId || null,
            allowedRoles: allowedRoles ? JSON.parse(allowedRoles) : [],
            uploadedBy: req.user.id
        });

        const populatedDoc = await Document.findById(doc._id)
            .populate('organization', 'name')
            .populate('uploadedBy', 'name email');

        res.status(201).json({ success: true, data: populatedDoc });
    } catch (err) {
        console.error(err);
        res.status(502).json({ success: false, message: 'Failed to upload document: ' + err.message });
    }
};

// ──────────────────────────────────────────────────────────
// SUPER ADMIN: UPDATE DOCUMENT
// ──────────────────────────────────────────────────────────
exports.updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { documentName, docType, organizationId, allowedRoles } = req.body;

        const doc = await Document.findById(id);
        if (!doc) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }

        // Update metadata
        if (documentName) doc.documentName = documentName;
        if (docType) doc.docType = docType;
        if (organizationId !== undefined) doc.organization = organizationId || null;
        if (allowedRoles !== undefined) doc.allowedRoles = JSON.parse(allowedRoles);
        doc.updatedBy = req.user.id;

        // Replace file if provided
        if (req.file) {
            const oldPublicId = doc.cloudinaryPublicId;

            // Upload new file
            const uploadPromise = new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'documents', resource_type: 'raw' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
            });

            const cloudinaryResult = await uploadPromise;

            doc.url = cloudinaryResult.secure_url;
            doc.cloudinaryPublicId = cloudinaryResult.public_id;

            // Delete old file from Cloudinary (best-effort)
            if (oldPublicId) {
                cloudinary.uploader.destroy(oldPublicId, { resource_type: 'raw' })
                    .catch(err => console.error('Failed to delete old file from Cloudinary:', err));
            }
        }

        await doc.save();

        const populatedDoc = await Document.findById(doc._id)
            .populate('organization', 'name')
            .populate('uploadedBy', 'name email')
            .populate('updatedBy', 'name email');

        res.status(200).json({ success: true, data: populatedDoc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ──────────────────────────────────────────────────────────
// SUPER ADMIN: DELETE DOCUMENT
// ──────────────────────────────────────────────────────────
exports.deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await Document.findById(id);

        if (!doc) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }

        // Delete from Cloudinary (best-effort)
        if (doc.cloudinaryPublicId) {
            cloudinary.uploader.destroy(doc.cloudinaryPublicId, { resource_type: 'raw' })
                .catch(err => console.error('Cloudinary deletion failed:', err));
        }

        await doc.deleteOne();

        res.status(200).json({ success: true, message: 'Document deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ──────────────────────────────────────────────────────────
// NON-SUPER ADMIN: GET MY DOCUMENTS
// ──────────────────────────────────────────────────────────
exports.getMyDocuments = async (req, res) => {
    try {
        const Employee = require('../models/Employee');
        const employee = await Employee.findOne({ user: req.user._id });
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee profile not found' });
        }
        
        const query = { 
            $or: [
                { owner: employee._id },
                { owner: { $exists: false } },
                { owner: null }
            ]
        };
        const docs = await Document.find(query)
            .populate('owner', 'name')
            .populate('uploadedBy', 'name');
        res.status(200).json({ success: true, count: docs.length, data: docs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ──────────────────────────────────────────────────────────
// GET DOCUMENT STATS (counts by org & docType)
// ──────────────────────────────────────────────────────────
exports.getDocumentStats = async (req, res) => {
    try {
        const statsByOrg = await Document.aggregate([
            {
                $group: {
                    _id: '$organization',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'organizations',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'orgInfo'
                }
            },
            {
                $project: {
                    organizationId: '$_id',
                    organizationName: { $arrayElemAt: ['$orgInfo.name', 0] },
                    count: 1
                }
            }
        ]);

        const statsByType = await Document.aggregate([
            {
                $group: {
                    _id: '$docType',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                byOrganization: statsByOrg,
                byType: statsByType
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
};
