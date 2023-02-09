const controller = require('app/http/controllers/controller');
const Role = require('app/models/role');
const Permission = require('app/models/permission');

class roleController extends controller {
	async index(req, res, next) {
		try {
			let page = req.query.page || 1;
			let roles = await Role.paginate(
				{},
				{ page, sort: { createdAt: 1 }, limit: 10 },
			);
			res.render('admin/users/roles/index', { title: 'سطوح دسترسی', roles });
		} catch (err) {
			next(err);
		}
	}

	async create(req, res) {
		let permissions = await Permission.find({});
		res.render('admin/users/roles/create', { permissions });
	}

	async store(req, res, next) {
		try {
			let status = await this.validationData(req);
			if (!status) return this.back(req, res);
			let { title, label, permissions } = req.body;
			let newRole = new Role({
				title,
				label,
				permissions,
			});
			await newRole.save();
			return res.redirect('/admin/users/roles');
		} catch (err) {
			next(err);
		}
	}

	async edit(req, res, next) {
		try {
			this.isMongoId(req.params.id);
			let role = await Role.findById(req.params.id);
			let permissions = await Permission.find({});
			if (!role) this.error('چنین نقشی وجود ندارد', 404);
			return res.render('admin/users/roles/edit', { role, permissions });
		} catch (err) {
			next(err);
		}
	}

	async update(req, res, next) {
		try {
			let status = await this.validationData(req);
			if (!status) return this.back(req, res);
			let { title, label, permissions } = req.body;
			await Role.findByIdAndUpdate(req.params.id, {
				$set: {
					title,
					label,
					permissions,
				},
			});
			return res.redirect('/admin/users/roles');
		} catch (err) {
			next(err);
		}
	}

	async destroy(req, res, next) {
		try {
			this.isMongoId(req.params.id);
			let role = await Role.findById(req.params.id);
			if (!role) this.error('چنین نقشی وجود ندارد', 404);
			role.remove();
			return res.redirect('/admin/users/roles');
		} catch (err) {
			next(err);
		}
	}
}

module.exports = new roleController();
