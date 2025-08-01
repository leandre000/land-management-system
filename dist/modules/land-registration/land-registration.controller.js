"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandRegistrationController = void 0;
const common_1 = require("@nestjs/common");
const land_registration_service_1 = require("./land-registration.service");
const create_land_dto_1 = require("./dto/create-land.dto");
const create_land_geojson_dto_1 = require("./dto/create-land-geojson.dto");
const update_land_dto_1 = require("./dto/update-land.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../common/enums/user-role.enum");
let LandRegistrationController = class LandRegistrationController {
    landRegistrationService;
    constructor(landRegistrationService) {
        this.landRegistrationService = landRegistrationService;
    }
    create(createLandDto, req) {
        return this.landRegistrationService.create({
            ...createLandDto,
            ownerId: req.user.id,
        });
    }
    createWithGeoJson(createLandDto, req) {
        const landData = {
            ...createLandDto,
            ownerId: req.user.id,
        };
        return this.landRegistrationService.createWithGeoJson(landData, req.user.id);
    }
    findAll() {
        return this.landRegistrationService.findAll();
    }
    findNearby(lat, lng, radius) {
        return this.landRegistrationService.findNearby(+lat, +lng, +radius || 1000);
    }
    findMyLands(req) {
        return this.landRegistrationService.findByOwner(req.user.id);
    }
    findOne(id) {
        return this.landRegistrationService.findOne(id);
    }
    update(id, updateLandDto) {
        return this.landRegistrationService.update(id, updateLandDto);
    }
    remove(id) {
        return this.landRegistrationService.remove(id);
    }
    verify(id, req) {
        return this.landRegistrationService.verify(id, req.user.id);
    }
    async generateCertificate(id, req, res) {
        try {
            const pdfBuffer = await this.landRegistrationService.generateLandCertificate(id, req.user.id);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="land-certificate-${id}.pdf"`,
                'Content-Length': pdfBuffer.length,
            });
            res.status(common_1.HttpStatus.OK).send(pdfBuffer);
        }
        catch (error) {
            res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to generate certificate',
                error: error.message,
            });
        }
    }
    async generateCertificateHtml(id, req, res) {
        try {
            const html = await this.landRegistrationService.generateLandCertificateHtml(id, req.user.id);
            res.set({
                'Content-Type': 'text/html',
            });
            res.status(common_1.HttpStatus.OK).send(html);
        }
        catch (error) {
            res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Failed to generate HTML certificate',
                error: error.message,
            });
        }
    }
};
exports.LandRegistrationController = LandRegistrationController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new land' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The land has been successfully registered.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_land_dto_1.CreateLandDto, Object]),
    __metadata("design:returntype", void 0)
], LandRegistrationController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('geojson'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new land using GeoJSON polygon' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The land has been successfully registered from GeoJSON.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_land_geojson_dto_1.CreateLandGeoJsonDto, Object]),
    __metadata("design:returntype", void 0)
], LandRegistrationController.prototype, "createWithGeoJson", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all registered lands' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all registered lands.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LandRegistrationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('nearby'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.CITIZEN),
    (0, swagger_1.ApiOperation)({ summary: 'Get nearby lands' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return nearby lands using postGIS spartial coordinates' }),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Query)('radius')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], LandRegistrationController.prototype, "findNearby", null);
__decorate([
    (0, common_1.Get)('my-lands'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.CITIZEN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all lands owned by the current user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all lands owned by the current user.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LandRegistrationController.prototype, "findMyLands", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.CITIZEN, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific land' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the land.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LandRegistrationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.CITIZEN),
    (0, swagger_1.ApiOperation)({ summary: 'Update a land' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The land has been successfully updated.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_land_dto_1.UpdateLandDto]),
    __metadata("design:returntype", void 0)
], LandRegistrationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.CITIZEN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a land' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The land has been successfully deleted.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], LandRegistrationController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/verify'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.LAND_OFFICER),
    (0, swagger_1.ApiOperation)({ summary: 'Verify a land' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'The land has been successfully verified.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], LandRegistrationController.prototype, "verify", null);
__decorate([
    (0, common_1.Get)(':id/certificate'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.CITIZEN, user_role_enum_1.UserRole.LAND_OFFICER, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Generate and download land certificate PDF' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Land certificate PDF generated successfully.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], LandRegistrationController.prototype, "generateCertificate", null);
__decorate([
    (0, common_1.Get)(':id/certificate-html'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.CITIZEN, user_role_enum_1.UserRole.LAND_OFFICER, user_role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Generate land certificate as HTML (for debugging)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Land certificate HTML generated successfully.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], LandRegistrationController.prototype, "generateCertificateHtml", null);
exports.LandRegistrationController = LandRegistrationController = __decorate([
    (0, swagger_1.ApiTags)('land-registration'),
    (0, common_1.Controller)('land-registration'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [land_registration_service_1.LandRegistrationService])
], LandRegistrationController);
//# sourceMappingURL=land-registration.controller.js.map