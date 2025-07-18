import { ApiProperty } from '@nestjs/swagger';

export class DeptNoSearchResult {
  @ApiProperty({ description: '부서번호' })
  deptNo: string;

  @ApiProperty({ description: '부서명' })
  deptNm: string;

  @ApiProperty({ description: '시작일자' })
  strtDt: string;

  @ApiProperty({ description: '종료일자' })
  endDt: string;

  @ApiProperty({ description: '부서구분코드' })
  deptDivCd: string;

  @ApiProperty({ description: '부서구분명' })
  deptDivNm: string;

  @ApiProperty({ description: '본부구분코드' })
  hqDivCd: string;

  @ApiProperty({ description: '본부구분명' })
  hqDivNm: string;

  @ApiProperty({ description: '사업부서구분' })
  bsnDeptKb: string;
}

export class DeptNoSearchResponseDto {
  @ApiProperty({ type: [DeptNoSearchResult], description: '부서 리스트' })
  data: DeptNoSearchResult[];

  @ApiProperty({ description: '총 건수' })
  totalCount: number;
}

export class DeptDivCodeDto {
  @ApiProperty({ description: '부서구분코드' })
  code: string;

  @ApiProperty({ description: '부서구분명' })
  name: string;
} 