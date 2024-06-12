"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const passport_1 = __importDefault(require("./config/passport"));
const database_config_1 = __importDefault(require("./config/database.config"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const CompanyRoutes_1 = __importDefault(require("./routes/CompanyRoutes"));
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(passport_1.default.initialize());
// Parse URL-encoded bodies
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json('Welcome to AkauntCalc!');
}));
app.use('/api/v1/user', UserRoutes_1.default);
app.use('/api/v1/company', CompanyRoutes_1.default);
// Sync models with database
database_config_1.default.sync({ alter: true })
    .then(() => {
    console.log('Database synchronized successfully.');
})
    .catch(err => {
    console.error('Error synchronizing database:', err);
});
app.listen(PORT, () => {
    console.log(`The application is listening on port ${PORT}`);
});
