import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from '../database/database.provider';
import { DeptNoSearchResult, DeptNoSearchResponseDto, DeptDivCodeDto } from './dto/dept-no-search.dto';

const DEPT_NO_SEARCH_CONSTANTS = {
  MAX_ROWS: 100,
} as const;

@Injectable()
export class DeptNoSearchService {
  private readonly logger = new Logger(DeptNoSearchService.name);
  constructor(private readonly oracleService: OracleService) {}

  /**
   * 부서번호/년도/부서구분코드로 부서 리스트 조회
   */
  async searchDeptNo(
    deptNo: string,
    year: string,
    deptDivCd?: string,
  ): Promise<DeptNoSearchResponseDto> {
    this.logger.log(`searchDeptNo called: deptNo=${deptNo}, year=${year}, deptDivCd=${deptDivCd}`);
    const oracledb = require('oracledb');
    const conn = await this.oracleService.getConnection();
    try {
      const result = await conn.execute(
        `BEGIN BISBM.COM_02_0301_S(:o_result, :i_dept_no, :i_year, :i_dept_div_cd); END;`,
        {
          o_result: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
          i_dept_no: deptNo,
          i_year: year,
          i_dept_div_cd: deptDivCd ?? null,
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
      const cursor = (result as any).outBinds.o_result;
      const rows: DeptNoSearchResult[] = [];
      let row;
      let count = 0;
      while ((row = await cursor.getRow()) && count < DEPT_NO_SEARCH_CONSTANTS.MAX_ROWS) {
        rows.push(row);
        count++;
      }
      await cursor.close();
      const response = new DeptNoSearchResponseDto();
      response.data = rows;
      response.totalCount = rows.length;
      console.log('[DeptNoSearchService] 반환 response:', response);
      return response;
    } finally {
      await conn.close();
    }
  }

  /**
   * 부서구분코드(112) 목록 조회
   */
  async getDeptDivCodes(): Promise<DeptDivCodeDto[]> {
    const conn = await this.oracleService.getConnection();
    try {
      const result = await conn.execute(
        `SELECT SML_CSF_CD as code, SML_CSF_NM as name FROM TBL_SML_CSF_CD WHERE LRG_CSF_CD = '112' ORDER BY SML_CSF_CD`,
        [],
        { outFormat: (require('oracledb').OUT_FORMAT_OBJECT) }
      );
      return (result.rows as DeptDivCodeDto[]) ?? [];
    } finally {
      await conn.close();
    }
  }
} 