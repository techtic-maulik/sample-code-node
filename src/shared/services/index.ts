import { TgService } from '../services/tg/tg.service';
import { GoogleStrategy } from '../services/social_media/google.strategy';
import { SocialMediaService } from '../services/social_media/socialMedia.service';
import { PostgreSQLService } from '../../common/postgresql.service';
import { CommonJSMethodService } from '../../common/commonjsMethods.service';
import { RowService } from '../services/row/row.service';
import { ColumnService } from '../services/column/column.service';

export { TgService } from '../services/tg/tg.service';
export { GoogleStrategy } from '../services/social_media/google.strategy';
export { SocialMediaService } from '../services/social_media/socialMedia.service';
export { PostgreSQLService } from '../../common/postgresql.service';
export { CommonJSMethodService } from '../../common/commonjsMethods.service';
export { RowService } from '../services/row/row.service';
export { ColumnService } from '../services/column/column.service';

const Services: any = [
  PostgreSQLService,
  TgService,
  GoogleStrategy,
  SocialMediaService,
  CommonJSMethodService,
  ColumnService,
  RowService,
];

export { Services };
