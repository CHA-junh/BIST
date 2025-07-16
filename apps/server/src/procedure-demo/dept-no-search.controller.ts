import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DeptNoSearchService } from './dept-no-search.service';
import { DeptNoSearchResult, DeptNoSearchResponseDto, DeptDivCodeDto } from './dto/dept-no-search.dto';

/**
 * 부서번호 검색 관련 API 컨트롤러
 * 부서번호/년도/부서구분코드로 부서 리스트 및 부서구분코드 목록을 제공합니다.
 */
@Controller('api/procedure')
export class DeptNoSearchController {
  constructor(private readonly deptNoSearchService: DeptNoSearchService) {}

  /**
   * 부서번호/년도/부서구분코드로 부서 리스트 조회
   * @param deptNo 부서번호
   * @param year 년도
   * @param deptDivCd 부서구분코드(선택)
   */
  @Get('search')
  @ApiOperation({ summary: '부서번호 검색', description: '부서번호/년도/부서구분코드로 부서 리스트를 조회합니다.' })
  @ApiQuery({ name: 'deptNo', required: true, description: '부서번호' })
  @ApiQuery({ name: 'year', required: true, description: '년도' })
  @ApiQuery({ name: 'deptDivCd', required: false, description: '부서구분코드' })
  @ApiResponse({ status: 200, description: '부서 리스트 조회 성공', type: DeptNoSearchResponseDto })
  async searchDeptNo(
    @Query('deptNo') deptNo: string,
    @Query('year') year: string,
    @Query('deptDivCd') deptDivCd?: string,
  ): Promise<DeptNoSearchResponseDto> {
    return this.deptNoSearchService.searchDeptNo(deptNo, year, deptDivCd);
  }

  /**
   * 부서구분코드(112) 목록 조회
   */
  @Get('codes')
  @ApiOperation({ summary: '부서구분코드 목록', description: '부서구분코드(112) 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '부서구분코드 목록 조회 성공', type: [DeptDivCodeDto] })
  async getDeptDivCodes(): Promise<DeptDivCodeDto[]> {
    return this.deptNoSearchService.getDeptDivCodes();
  }
} 