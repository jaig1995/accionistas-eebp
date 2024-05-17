import { AcademyMockApi } from 'app/mock-api/apps/academy/api';
import { ChatMockApi } from 'app/mock-api/apps/chat/api';
import { ECommerceInventoryMockApi } from 'app/mock-api/apps/ecommerce/inventory/api';
import { FileManagerMockApi } from 'app/mock-api/apps/file-manager/api';
import { HelpCenterMockApi } from 'app/mock-api/apps/help-center/api';
import { NotesMockApi } from 'app/mock-api/apps/notes/api';
import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { MessagesMockApi } from 'app/mock-api/common/messages/api';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NotificationsMockApi } from 'app/mock-api/common/notifications/api';
import { SearchMockApi } from 'app/mock-api/common/search/api';
import { ShortcutsMockApi } from 'app/mock-api/common/shortcuts/api';
import { AnalyticsMockApi } from 'app/mock-api/dashboards/analytics/api';
import { CryptoMockApi } from 'app/mock-api/dashboards/crypto/api';
import { FinanceMockApi } from 'app/mock-api/dashboards/finance/api';
import { IconsMockApi } from 'app/mock-api/ui/icons/api';
import { CreateTemplateMockApi } from './apps/creacion-plantilla/api';
import { RegistroPoderesMockApi } from './apps/registro-poderes/api';
import { PostulacionesMockApi } from './apps/postulaciones/api';
import { CrearAsambleaMockApi } from './apps/crear-asamblea/api';
import { AsitenciaAsambleaMockApi } from './apps/asistencia-asamblea/api';
import { VotacionesMockApi } from './apps/votaciones/api';

export const mockApiServices = [
    AcademyMockApi,
    AnalyticsMockApi,
    AuthMockApi,
    ChatMockApi,
    CryptoMockApi,
    ECommerceInventoryMockApi,
    FileManagerMockApi,
    FinanceMockApi,
    HelpCenterMockApi,
    IconsMockApi,
    MessagesMockApi,
    NavigationMockApi,
    NotesMockApi,
    NotificationsMockApi,
    SearchMockApi,
    ShortcutsMockApi,
    CreateTemplateMockApi,
    RegistroPoderesMockApi,
    PostulacionesMockApi,
    CrearAsambleaMockApi,
    AsitenciaAsambleaMockApi,
    VotacionesMockApi
];
